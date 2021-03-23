import { NextPageContext } from 'next';
import { makeStyles, Paper, Typography } from '@material-ui/core';

import { errors } from 'utils/errors';
import Layout from 'components/Layout';

type ErrorType = ValueOf<typeof errors>;

export const useErrorStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
    textAlign: 'center'
  },
  message: {
    '& > *': {
      margin: theme.spacing(1, 0)
    }
  }
}));

function ErrorPage({ error: errorObj }: { error: ErrorType }) {
  const classes = useErrorStyles();
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

ErrorPage.getInitialProps = async function (ctx: NextPageContext): Promise<{ error: ErrorType }> {
  const status = Number(ctx?.err?.statusCode ?? ctx?.res?.statusCode ?? 200);
  const error = Object.values(errors).find(err => err.statusCode === status) || errors.default;

  return { error };
};

export default ErrorPage;
