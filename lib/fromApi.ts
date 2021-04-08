import Axios, { AxiosRequestConfig } from 'axios';
import { NextPageContext } from 'next';

const fromApi = (ctx: NextPageContext | undefined = undefined) => {
  const config: AxiosRequestConfig = {
    withCredentials: true
  };
  if (typeof window === 'undefined') {
    config.headers = { cookie: ctx?.req?.headers?.cookie };
    config.baseURL = process.env.NEXTAUTH_URL;
  }
  return Axios.create(config);
};

export default fromApi;
