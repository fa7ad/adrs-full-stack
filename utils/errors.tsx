import { Button } from '@material-ui/core';
import Link from 'next/link';

export const errors: Record<
  'default' | 'configuration' | 'accessdenied' | 'verification' | 'notfound',
  {
    statusCode: number;
    heading: string;
    message: JSX.Element;
    signin?: JSX.Element;
  }
> = {
  default: {
    statusCode: 200,
    heading: 'Error',
    message: (
      <>
        <div>Click the link below to go back</div>
        <Link href='/'>&larr; ADRS Next</Link>
      </>
    )
  },
  notfound: {
    statusCode: 404,
    heading: 'Error',
    message: (
      <>
        <div>The page you're looking for doesn't exist</div>
        <Link href='/'>&larr; ADRS Next</Link>
      </>
    )
  },
  configuration: {
    statusCode: 500,
    heading: 'Server error',
    message: (
      <>
        <p>There is an issue with our server, please try again later.</p>
        <Link href='/'>&larr; ADRS Next</Link>
      </>
    )
  },
  accessdenied: {
    statusCode: 403,
    heading: 'Access Denied',
    message: (
      <>
        <p>You do not have permission to sign in.</p>
        <p>
          <Link href='/auth/signin'>
            <Button variant='contained' color='primary'>
              Sign in / Sign up
            </Button>
          </Link>
        </p>
      </>
    )
  },
  verification: {
    statusCode: 403,
    heading: 'Unable to sign in',
    message: (
      <>
        <p>The sign in link is no longer valid.</p>
        <p>It may have been used already or it may have expired.</p>
      </>
    ),
    signin: (
      <p>
        <Link href='/auth/signin'>
          <Button variant='contained' color='primary'>
            Sign in / Sign up
          </Button>
        </Link>
      </p>
    )
  }
};
