import { Fragment } from 'react';
import { NextPageContext } from 'next';
import { csrfToken, providers, signIn } from 'next-auth/client';
import { compose, map, ValueOfRecord, values } from 'ramda';

import { Button, makeStyles, Paper, TextField, Grid, Typography } from '@material-ui/core';


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

type AuthProviders = NonNullable<Unpromise<ReturnType<typeof providers>>>;
type SingleAuthProvider = ValueOfRecord<AuthProviders>;
type Props = React.PropsWithChildren<{}> & Unpromise<ReturnType<typeof SignIn.getInitialProps>>;

const handleSignIn: (id: string) => React.ReactEventHandler<HTMLButtonElement> = id => _ => {
  return signIn(id);
};

const makeProviderLoginButtons: (provs: AuthProviders) => JSX.Element[] = compose(
  map((provider: SingleAuthProvider) =>
    provider.id === 'email' ? (
      <Fragment key={provider.name} />
    ) : (
      <Grid item key={provider.name}>
        <Button onClick={handleSignIn(provider.id)} variant='contained' color='primary' size='large' fullWidth>
          Use {provider.name} account
        </Button>
      </Grid>
    )
  ),
  values
);

function SignIn({ providers, csrfToken }: Props) {
  const classes = useStyles();

  return (
    <Layout title='Authentication'>
      <Paper className={classes.root}>
        <Grid container direction='column' spacing={1}>
          <Grid item>
            <Typography component='h1' variant='h5' align='center'>
              Sign In / Sign Up
            </Typography>
          </Grid>
          <Grid item>
            <form method='POST' action='/api/auth/signin/email' className={classes.form}>
              <input name='csrfToken' type='hidden' value={csrfToken || ''} />
              <TextField name='email' label='Email Address' variant='outlined' required type='email' />
              <Button variant='contained' color='secondary' type='submit' size='large'>
                Use Email
              </Button>
            </form>
          </Grid>
          <Grid item>
            <Typography variant='body2' align='center'>
              &mdash; or &mdash;
            </Typography>
          </Grid>
          {makeProviderLoginButtons(providers ?? {})}
        </Grid>
      </Paper>
    </Layout>
  );
}

SignIn.getInitialProps = async (context: NextPageContext) => ({
  providers: await providers(context),
  csrfToken: await csrfToken(context)
});

export default SignIn;
