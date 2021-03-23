import { NextPageContext } from 'next';
import { csrfToken } from 'next-auth/client';
import { Button, makeStyles, Paper, Grid, Typography } from '@material-ui/core';

import Layout from 'components/Layout';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 2),
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(1, 0)
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1, 0)
    }
  }
}));

type Props = React.PropsWithChildren<{}> & Unpromise<ReturnType<typeof SignOut.getInitialProps>>;

function SignOut({ csrfToken }: Props) {
  const classes = useStyles();

  return (
    <Layout title='Sign out'>
      <Paper className={classes.root}>
        <Grid container direction='column' spacing={1}>
          <Grid item>
            <Typography component='h1' variant='h4' align='center'>
              Sign out
            </Typography>
          </Grid>
          <Grid item>
            <Typography align='center' paragraph>
              Are you sure you want to sign out?
            </Typography>
          </Grid>
          <Grid item>
            <form method='POST' action='/api/auth/signout' className={classes.form}>
              <input name='csrfToken' type='hidden' value={csrfToken || ''} />
              <Button variant='contained' color='secondary' type='submit' size='large'>
                Sign out
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}

SignOut.getInitialProps = async (context: NextPageContext) => ({
  csrfToken: await csrfToken(context)
});

export default SignOut;
