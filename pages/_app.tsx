import DayjsUtils from '@date-io/dayjs';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { colors, createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';

import { PageTitleCtx, useTitle } from 'utils/pageTitle';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.deepPurple[500]
    },
    secondary: {
      main: colors.blueGrey[700]
    }
  }
});

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const titleCtx = useTitle();
  return (
    <>
      <Head>
        <title>{titleCtx[0]}</title>
      </Head>
      <Provider session={pageProps.session}>
        <ThemeProvider theme={theme}>
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
