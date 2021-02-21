import React, { ReactNode } from 'react';
import { makeStyles, Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: '1 1 0',
    flexDirection: 'column'
  },
  footer: {
    backgroundColor: theme.palette.common.white,
    width: '100%',
    padding: theme.spacing(2)
  }
}));

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className='empty'>&nbsp;</div>
      {props.children}
      <Typography variant='body2' color='textSecondary' align='center' className={classes.footer}>
        Copyright ©{' ' + new Date().getFullYear() + ' '}
        <Link color='inherit' href='https://github.com/fa7ad'>
          @fa7ad
        </Link>
        . All rights reserved.
      </Typography>
    </div>
  );
};

export default Layout;
