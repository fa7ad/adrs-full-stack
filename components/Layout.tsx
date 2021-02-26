import React from 'react';
import { makeStyles } from '@material-ui/core';

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
    paddingTop: theme.spacing(8)
  }
}));

type Props = React.PropsWithChildren<{}>;

const Layout: React.FC<Props> = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NavBar />
      <div className={classes.main}>{props.children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
