import { makeStyles, Paper, Typography } from '@material-ui/core';

import { errors } from 'utils/errors';
import { useErrorStyles } from './_error';
import Layout from 'components/Layout';

export default function NotFound() {
  const classes = useErrorStyles();
  const errorObj = errors.notfound;
  return (
    <Layout title='Error'>
      <Paper className={classes.root}>
        <Typography component='h1' variant='h5'>
          {errorObj.heading}
        </Typography>
        <div className={classes.message}>{errorObj.message}</div>
        {errorObj.signin}
      </Paper>
    </Layout>
  );
}
