import React from 'react';
import { Container, makeStyles } from '@material-ui/core';

import NavBar from './Navbar';
import Footer from './Footer';

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
    justifyContent: 'center'
  }
}));

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NavBar />
      <div className={classes.main}>
        <Container maxWidth='sm'>
          <>{props.children}</>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
