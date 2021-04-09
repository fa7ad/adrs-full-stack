import fetch from 'cross-fetch';
import { getSession } from 'next-auth/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';

import { sendSMS } from 'lib/sms';
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
    const reqBody = req.body as { position?: Tuple<number, number>; phoneNums: string[] };
    try {
      const location = [reqBody.position?.[1], reqBody.position?.[0]].join(',');
      const gmapslink = `https://www.google.com/maps/place/${location}/@${location},16z`;
      const shortLink = await fetch(
        `http://cutt.ly/api/api.php?key=2b0a36896bd1481defd2e553b8f51134a10c9&short=${encodeURIComponent(gmapslink)}`
      ).then(r => r.json());
      const sms$ = contacts.map(ct => {
        const victim = user.profile?.name?.split(/\s/)[0];
        const ctname = ct?.name?.split(/\s/)[0];
        return sendSMS(
          ct.phone,
          `Hi ${ctname ?? ''}! ${victim} might have been in an accident. Police number: ${
            reqBody.phoneNums[0]
          }. Last known location: ${shortLink?.url?.shortLink ?? gmapslink}`
        );
      });
      const responses = await Promise.all(sms$);
      res.json({ success: true, smsResponses: responses });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new HTTPError(400, error.message.replace(/Invalid.*?invocation:/i, '').trim());
      }
      throw error;
    }
  })
  .make();
