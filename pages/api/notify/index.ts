import { getSession } from 'next-auth/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';

import prisma from 'lib/prisma';

import ApiRoute from 'utils/ApiRoute';
import HTTPError from 'utils/HttpError';

export default new ApiRoute()
  .post(async (req, res) => {
    const session = await getSession({ req });
    if (!session) throw new HTTPError(401, 'Unauthorized');
    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId as number },
      include: { profile: true }
    });
    if (!user) throw new HTTPError(500, 'Uh oh!');
    if (!user.profile) throw new HTTPError(404, 'No profile found!');
    const contacts = await prisma.emergencyContact.findMany({ where: { profileId: user.profile.id } });
    try {
      
      res.json({ success: true, contacts });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new HTTPError(400, error.message.replace(/Invalid.*?invocation:/i, '').trim());
      }
      throw error;
    }
  })
  .make();
