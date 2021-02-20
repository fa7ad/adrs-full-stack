import Head from 'next/head';
import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import { PageTitleCtx, useTitle } from 'utils/pageTitle';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const titleCtx = useTitle();
  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>{titleCtx[0]}</title>
      </Head>
      <PageTitleCtx.Provider value={titleCtx}>
        <Component {...pageProps} />
      </PageTitleCtx.Provider>
    </Provider>
  );
};

export default App;
