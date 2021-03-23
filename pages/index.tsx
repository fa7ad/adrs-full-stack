import { NextPageContext } from 'next';
import { useSession } from 'next-auth/client';
import { makeStyles, Paper } from '@material-ui/core';

import Layout from 'components/Layout';
import LandingPage from 'components/LandingPage';
import UserHome from 'components/UserHome';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 2)
  }
}));

function Home() {
  const classes = useStyles();
  const [session] = useSession();

  const auth = Boolean(session);

  return (
    <Layout title='Home'>
      <Paper className={classes.root}>{auth ? <UserHome /> : <LandingPage />}</Paper>
    </Layout>
  );
}

export default Home;
