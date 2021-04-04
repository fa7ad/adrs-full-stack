import Axios from 'axios';
import { NextPageContext } from 'next';

const clientCookie = typeof document !== 'undefined' ? document.cookie : '';

const api = Axios.create({
  withCredentials: true,
  headers: {
    cookie: clientCookie
  }
});

const fromApi = (ctx: NextPageContext | undefined = undefined) => {
  api.defaults.headers.cookie = ctx?.req?.headers?.cookie ?? clientCookie;
  return api;
};

export default fromApi;
