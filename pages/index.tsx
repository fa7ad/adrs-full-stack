import { useSession } from 'next-auth/client';
import { makeStyles, Paper } from '@material-ui/core';

import Layout from 'components/Layout';
import LandingPage from 'components/LandingPage';
import { usePageTitleEffect } from 'utils/pageTitle';

type Props = {};

const useStyles = makeStyles(theme => ({
  logoImage: {
    maxWidth: '10em',
    margin: theme.spacing(0, 'auto', 2, 'auto')
  },
  root: {
    padding: theme.spacing(4, 2)
  },
  heroButtons: {
    marginTop: theme.spacing(4),
    textAlign: 'center'
  }
}));

const Blog: React.FC<Props> = props => {
  const classes = useStyles();
  const [session] = useSession();

  const auth = Boolean(session);

  usePageTitleEffect('Home');

  return (
    <Layout>
      <Paper className={classes.root}>{auth ? null : <LandingPage classes={classes} />}</Paper>
    </Layout>
  );
};

export default Blog;
