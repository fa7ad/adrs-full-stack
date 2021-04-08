import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container, Fab, Hidden, makeStyles } from '@material-ui/core';

import NavBar from './Navbar';
import Footer from './Footer';
import { SettingsRemote } from '@material-ui/icons';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: '1 1 0',
    flexDirection: 'column',
    flexGrow: 1
  },
  main: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing(8, 0),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      padding: theme.spacing(8, 0, 0, 0),
      '& > *': {
        padding: 0
      },
      '& > * > *': {
        height: '100%'
      }
    }
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  hide: {
    display: 'none'
  }
}));

type Props = {
  title?: string;
};

const Layout: React.FC<Props> = props => {
  const classes = useStyles();
  const router = useRouter();

  const title = props.title || 'Home';

  return (
    <>
      <Head>
        <title>{title} | ADRS Next</title>
      </Head>

      <div className={classes.root}>
        <NavBar title={title} />
        <div className={classes.main}>
          <Container maxWidth='sm'>
            <>{props?.children || 'Unknown Error'}</>
          </Container>
        </div>
        <Footer />
      </div>
      <Hidden smUp>
        <Fab
          aria-label='Home'
          className={clsx(classes.fab, { [classes.hide]: router.asPath === '/' })}
          color='secondary'
          onClick={() => {
            router.push('/');
          }}
        >
          <SettingsRemote />
        </Fab>
      </Hidden>
    </>
  );
};

export default Layout;
