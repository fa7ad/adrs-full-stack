import Link from 'next/link';
import Image from 'next/image';
import { Button, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  logoImage: {
    maxWidth: '10em',
    margin: theme.spacing(0, 'auto', 2, 'auto')
  },
  heroButtons: {
    marginTop: theme.spacing(4),
    textAlign: 'center'
  }
}))

export default function LandingPage() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.logoImage}>
        <Image src='/assets/logo.svg' width={140} height={140} alt='' layout='fixed' />
      </div>
      <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
        Welcome
      </Typography>
      <Typography variant='subtitle1' align='center' color='textSecondary' paragraph>
        is an application that uses your smartphone's sensors and an innovative algorithms to detect, report and rescue
        you from a potentially fatal vehicular accident.
      </Typography>
      <div className={classes.heroButtons}>
        <Link href='/auth/signin'>
          <Button color='primary' variant='contained'>
            Sign In / Sign Up
          </Button>
        </Link>
      </div>
    </>
  );
}
