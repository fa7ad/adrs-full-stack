/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="node" />

import { PrismaClient } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global extends NodeJS.Global {
      prisma?: PrismaClient;
    }
  }

  type Tuple<A, B> = [A, B];
  type Tuple3<A, B, C> = [A, B, C];

  type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

  type ValueOf<T extends Record<any, any>> = T extends Record<infer U, infer V> ? V : never;
  type KeyOf<T extends Record<any, any>> = T extends Record<infer U, infer V> ? U : never;

  type SelectOption = {
    label: string;
    value: string;
  };

  interface ContactsData {
    name: string;
    phone: string;
  }

  interface ExistingContact extends ContactsData {
    id: number;
  }
  interface ContactState extends ExistingContact {
    editing: boolean;
  }

  type Identity<T> = (x: T) => T;
  declare namespace CommonComponents {
    type DrawerToggleHandler = React.EventHandler<
      React.KeyboardEvent<HTMLDivElement> & React.MouseEvent<HTMLDivElement>
    >;
  }
}
