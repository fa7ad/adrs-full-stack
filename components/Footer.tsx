import React from 'react';
import { Typography, Link, makeStyles, AppBar } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(2),
    top: 'auto',
    bottom: 0
  }
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <AppBar variant='outlined' color='transparent' position='fixed' component='footer' className={classes.footer}>
      <Typography variant='body2' color='textSecondary' align='center'>
        Copyright ©{' ' + new Date().getFullYear() + ' '}
        <Link color='inherit' href='https://github.com/fa7ad'>
          @fa7ad
        </Link>
        .All rights reserved.
      </Typography>
    </AppBar>
  );
}
