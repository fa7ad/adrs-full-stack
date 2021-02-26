import { IncomingMessage } from 'http';
import { GenericObject, SessionBase } from 'next-auth/_utils';

declare module 'next-auth/client' {
  type Session = SessionBase & GenericObject;

  interface GetProvidersResponse {
    [provider: string]: SessionProvider;
  }

  interface SessionProvider extends GenericObject {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  }

  interface ContextProviderProps {
    session: Session | null | undefined;
    options?: SetOptionsParams;
  }

  interface SetOptionsParams {
    baseUrl?: string;
    basePath?: string;
    clientMaxAge?: number;
    keepAlive?: number;
  }

  type ContextProvider = React.FC<ContextProviderProps>;

  interface NextContext {
    req?: IncomingMessage;
    ctx?: { req: IncomingMessage };
  }

  declare function useSession(): [Session | null | undefined, boolean];
  declare function providers(): Promise<GetProvidersResponse | null>;
  declare function providers(context: NextContext): Promise<GetProvidersResponse | null>;
  declare const getProviders: typeof providers;
  declare function session(
    context?: NextContext & {
      triggerEvent?: boolean;
    }
  ): Promise<Session | null>;
  declare const getSession: typeof session;
  declare function csrfToken(context?: NextContext): Promise<string | null>;
  declare const getCsrfToken: typeof csrfToken;
  declare function signin(
    provider?: string,
    data?: GenericObject & {
      callbackUrl?: string;
    }
  ): Promise<void>;
  declare const signIn: typeof signin;
  declare function signout(data?: { callbackUrl?: string }): Promise<void>;
  declare const signOut: typeof signout;
  declare function options(options: SetOptionsParams): void;
  declare const setOptions: typeof options;
  declare const Provider: ContextProvider;
}
