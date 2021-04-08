import { getSession } from 'next-auth/client';

import { Profile } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import prisma from 'lib/prisma';

import ApiRoute from 'utils/ApiRoute';
import HTTPError from 'utils/HttpError';

export default new ApiRoute()
  .put(async (req, res) => {
    const session = await getSession({ req });
    if (!session) throw new HTTPError(401, 'Unauthorized');
    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId as number } });
    if (!user) throw new HTTPError(500, 'Uh oh!');
    try {
      const reqBody = req.body as Partial<Profile>;
      let prof = await prisma.profile.findUnique({
        where: {
          userId: user.id
        }
      });
      if (!prof) {
        prof = await prisma.profile.create({
          data: {
            ...(reqBody as Profile),
            userId: user.id,
            name: reqBody.name || '' + user.name
          }
        });
      } else {
        prof = await prisma.profile.update({
          where: { id: prof.id },
          data: reqBody
        });
      }

      const profile = prof;
      res.json({ success: true, profile });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new HTTPError(400, error.message.replace(/Invalid.*?invocation:/i, '').trim());
      }
      throw error;
    }
  })
  .get(async (req, res) => {
    const session = await getSession({ req });
    if (!session) throw new HTTPError(401, 'Unauthorized');
    const userId = session.user.id as number;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    });
    if (user?.profile) {
      res.json({ success: true, profile: user.profile });
    } else {
      res.json({ success: false, profile: null });
    }
  })
  .make();
