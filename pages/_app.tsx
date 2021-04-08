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
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='apple-mobile-web-app-title' content='ADRS' />
        <meta name='application-name' content='ADRS' />
        <meta name='msapplication-TileColor' content='#b91d47' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <Provider session={pageProps.session}>
        <ThemeProvider theme={muiTheme}>
          <MuiPickersUtilsProvider utils={DayjsUtils}>
            <CssBaseline />
            <Component {...pageProps} />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Provider>
      <script
        type='module'
        dangerouslySetInnerHTML={{
          __html: `import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';
const el = document.createElement('pwa-update');
document.body.appendChild(el);`
        }}
      />
    </>
  );
};

export default App;
