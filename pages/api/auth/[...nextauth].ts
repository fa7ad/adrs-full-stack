import { NextApiHandler } from 'next';
import NextAuth, { InitOptions } from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

import { assocPath } from 'ramda';

import prisma from 'lib/prisma';
import { getEnv } from 'utils/getEnv';

const options: InitOptions = {
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
  secret: getEnv('SECRET'),
  callbacks: {
    async session(session, user) {
      return assocPath(['user', 'id'], user?.id, session);
    },
    async redirect(_, baseUrl) {
      return baseUrl;
    }
  },
  pages: {
    newUser: '/profile',
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  }
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
