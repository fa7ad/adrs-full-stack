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

  declare namespace CommonComponents {
    type DrawerToggleHandler = React.EventHandler<
      React.KeyboardEvent<HTMLDivElement> & React.MouseEvent<HTMLDivElement>
    >;
  }
}
