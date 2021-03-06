import { useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

import DayjsUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

import muiTheme from 'lib/muiTheme';
import { PageTitleCtx, useTitle } from 'utils/pageTitle';

import 'utils/global.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const titleCtx = useTitle();

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <>
      <Head>
        <title>{titleCtx[0]}</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>
      <Provider session={pageProps.session}>
        <ThemeProvider theme={muiTheme}>
          <MuiPickersUtilsProvider utils={DayjsUtils}>
            <CssBaseline />
            <PageTitleCtx.Provider value={titleCtx}>
              <Component {...pageProps} />
            </PageTitleCtx.Provider>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
};

export default App;
