import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import HTTPError from './HttpError';
import runMiddleware from './runMiddleware';

type apiHandlers = 'getHandler' | 'postHandler' | 'putHandler' | 'deleteHandler';
type NextApiMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: Error) => void
) => Promise<void> | void;

export default class ApiRoute {
  private getHandler: NextApiHandler | undefined;
  private postHandler: NextApiHandler | undefined;
  private putHandler: NextApiHandler | undefined;
  private deleteHandler: NextApiHandler | undefined;
  private mw: NextApiMiddleware | undefined;

  private handleError: (handler: NextApiHandler) => NextApiHandler = handler => async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      if (error instanceof HTTPError) {
        res.status(error.status).json({ success: false, message: error.message, error: error.error });
        return;
      }
      res.status(500).json({
        success: false,
        message: error?.message || error,
        error
      });
    }
  };

  private _registerMethodHandler(type: apiHandlers) {
    return (handler: NextApiHandler) => {
      this[type] = handler;
      return this;
    };
  }

  get = this._registerMethodHandler('getHandler');
  post = this._registerMethodHandler('postHandler');
  put = this._registerMethodHandler('putHandler');
  delete = this._registerMethodHandler('deleteHandler');

  middleware(mw: NextApiMiddleware): ApiRoute {
    this.mw = mw;
    return this;
  }

  make(): NextApiHandler {
    return this.handleError(async (req, res) => {
      let handler: NextApiHandler | undefined;
      switch (req.method) {
        case 'GET':
          handler = this.getHandler;
          break;
        case 'POST':
          handler = this.postHandler;
          break;
        case 'PUT':
          handler = this.putHandler;
          break;
        case 'DELETE':
          handler = this.deleteHandler;
          break;
        default:
          break;
      }
      if (!handler) throw new HTTPError(405, 'Method not allowed');
      if (this.mw) await runMiddleware(req, res, this.mw);
      return handler(req, res);
    });
  }
}
