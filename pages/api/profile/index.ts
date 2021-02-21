import { Profile } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import prisma from 'lib/prisma';
import { getSession } from 'next-auth/client';
import { assoc } from 'ramda';
import ApiRoute from 'utils/ApiRoute';
import HTTPError from 'utils/HttpError';

export default new ApiRoute()
  .post(async (req, res) => {
    const session = await getSession({ req });
    if (!session) throw new HTTPError(401, 'Unauthorized');
    const userId = session.user.id;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId as number
        }
      });
      if (!user) throw new HTTPError(400, 'Malformed request');

      const reqBody = req.body as Profile;

      if (!user.name && reqBody.name) {
        user.name = reqBody.name;
        await prisma.user.update({
          where: { id: user.id },
          data: user
        });
      }

      const name = user.name as string;

      const profile = await prisma.profile.create({
        data: {
          ...reqBody,
          name,
          userId: user.id
        }
      });
      res.json({ success: true, profileId: profile.id });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new HTTPError(400, error.message.replace(/Invalid.*?invocation:/i, '').trim());
      } else throw error;
    }
  })
  .make();
