import Link from 'next/link';
import Image from 'next/image';
import { Button, Typography } from '@material-ui/core';

type Props = {
  classes: Record<'logoImage' | 'heroButtons', string>;
};

export default function LandingPage({ classes }: Props) {
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
