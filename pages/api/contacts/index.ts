import { getSession } from 'next-auth/client';

import { EmergencyContact } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import prisma from 'lib/prisma';

import ApiRoute from 'utils/ApiRoute';
import HTTPError from 'utils/HttpError';

export default new ApiRoute()
  .put(async (req, res) => {
    const session = await getSession({ req });
    if (!session) throw new HTTPError(401, 'Unauthorized');
    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId as number },
      include: { profile: true }
    });
    if (!user) throw new HTTPError(500, 'Uh oh!');
    if (!user?.profile) throw new HTTPError(404, 'No profile found!');

    try {
      const body = req.body as Partial<EmergencyContact>;
      if (!body?.id) throw new HTTPError(400, 'Contact ID is required!');

      const _contact = await prisma.emergencyContact.findUnique({ where: { id: body.id } });
      if (!_contact) throw new HTTPError(400, 'Invalid Contact ID!');

      const contact = await prisma.emergencyContact.update({ where: { id: _contact.id }, data: body });
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new HTTPError(400, error.message.replace(/Invalid.*?invocation:/i, '').trim());
      }
      throw error;
    }
  })
  .post(async (req, res) => {
    const session = await getSession({ req });
    if (!session) throw new HTTPError(401, 'Unauthorized');
    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId as number },
      include: { profile: true }
    });
    if (!user) throw new HTTPError(500, 'Uh oh!');
    if (!user?.profile) throw new HTTPError(404, 'No profile found!');

    try {
      await prisma.emergencyContact.create({
        data: {
          ...(req.body as EmergencyContact),
          profileId: user.profile.id
        }
      });
      const contacts = await prisma.emergencyContact.findMany({ where: { profileId: user.profile.id } });
      res.json({ success: true, contacts });
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
    if (!user?.profile) {
      throw new HTTPError(404, 'Profile not found!');
    }

    const contacts = await prisma.emergencyContact.findMany({ where: { profileId: user.profile.id } });
    res.json({ success: true, contacts });
  })
  .make();
