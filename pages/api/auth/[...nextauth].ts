import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

import prisma from 'lib/prisma';
import { getEnv } from 'utils/getEnv';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    Providers.Email({
      server: {
        host: getEnv('EMAIL_SERVER_HOST'),
        port: parseInt(getEnv('EMAIL_SERVER_PORT'), 10),
        auth: {
          user: getEnv('EMAIL_SERVER_USER'),
          pass: getEnv('EMAIL_SERVER_PASSWORD')
        }
      },
      from: getEnv('EMAIL_FROM')
    }),
    Providers.Google({
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET')
    })
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: getEnv('SECRET')
};
