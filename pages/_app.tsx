import { useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

import DayjsUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

import muiTheme from 'lib/muiTheme';

import 'utils/global.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <>
      <Head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>
      <Provider session={pageProps.session}>
        <ThemeProvider theme={muiTheme}>
          <MuiPickersUtilsProvider utils={DayjsUtils}>
            <CssBaseline />
            <Component {...pageProps} />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
};

export default App;
