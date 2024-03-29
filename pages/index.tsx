import { useSession } from 'next-auth/client';
import { makeStyles, Paper } from '@material-ui/core';

import Layout from 'components/Layout';
import LandingPage from 'components/LandingPage';
import UserHome from 'components/UserHome';

const useStyles = makeStyles(theme => ({
  root: {
    padding: props => ((props as any).auth ? theme.spacing(0, 2, 2, 2) : theme.spacing(4, 2))
  }
}));

function Home() {
  const [session] = useSession();
  const auth = Boolean(session);
  const classes = useStyles({ auth });

  return (
    <Layout title='Home'>
      <Paper className={classes.root}>{auth ? <UserHome /> : <LandingPage />}</Paper>
    </Layout>
  );
}

export default Home;
