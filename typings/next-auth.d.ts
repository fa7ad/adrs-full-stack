/// <reference types="next-auth" />
import * as NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User extends NextAuth.User {
    id?: number | null;
  }
}
