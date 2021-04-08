import dayjs from 'dayjs';
import * as yup from 'yup';
import { evolve, mergeRight } from 'ramda';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { DatePicker } from 'formik-material-ui-pickers';
import { Button, LinearProgress, makeStyles, Paper, Typography } from '@material-ui/core';

import Layout from 'components/Layout';
import fromApi from 'lib/fromApi';

interface ProfileData {
  name: string;
  phone: string;
  dob: Date;
  nidNumber: string;
  drivingLicense: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 2)
  },
  heading: {
    margin: theme.spacing(0)
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1, 0)
    }
  }
}));

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^(?:\+?88)?(01[3-9]\d{8})?$/, 'Enter a valid phone number'),
  dob: yup
    .date()
    .required('Date of Birth is required')
    .max(dayjs().subtract(18, 'years').toDate(), 'You need to be at least 18 to use this app!'),
  nidNumber: yup.string().required('NID Number is required'),
  drivingLicense: yup.string().required('Driving License is required')
});

const Profile: NextPage<{} & Unpromise<ReturnType<typeof getInitialProps>>> = function Profile(props) {
  const router = useRouter();
  const classes = useStyles();

  const initialValues = mergeRight(
    {
      name: '',
      phone: '',
      dob: dayjs().toDate(),
      nidNumber: '',
      drivingLicense: ''
    },
    props.profile
  );

  const newProfile = Boolean(
    initialValues.name + initialValues.phone + initialValues.nidNumber + initialValues.drivingLicense
  );

  const onSubmit = async (data: ProfileData) => {
    const formData = evolve({ dob: d => dayjs(d).toISOString() }, data);
    await fromApi().put('/api/profile', formData);
    router.push('/');
  };

  return (
    <Layout title='Profile'>
      <Paper className={classes.root}>
        <Typography component='h1' variant='h5' align='center' className={classes.heading}>
          {newProfile ? 'Edit' : 'Create'} Profile
        </Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ submitForm, isSubmitting }) => (
            <Form className={classes.form}>
              <Field
                component={TextField}
                fullWidth
                variant='outlined'
                id='name'
                name='name'
                label='Full Name'
                required
              />
              <Field
                component={TextField}
                fullWidth
                variant='outlined'
                id='phone'
                name='phone'
                label='Phone Number'
                required
              />
              <Field
                component={DatePicker}
                disableFuture
                openTo='year'
                format='DD/MM/YYYY'
                inputVariant='outlined'
                fullWidth
                id='dob'
                name='dob'
                label='Date of Birth'
                views={['year', 'month', 'date']}
              />
              <Field
                component={TextField}
                fullWidth
                variant='outlined'
                id='nidNumber'
                name='nidNumber'
                label='NID Number'
                required
              />
              <Field
                component={TextField}
                fullWidth
                variant='outlined'
                id='drivingLicense'
                name='drivingLicense'
                label='Driving License Number'
                required
              />
              {isSubmitting && <LinearProgress />}
              <br />
              <Button
                variant='contained'
                color='primary'
                size='large'
                fullWidth
                disabled={isSubmitting}
                onClick={submitForm}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Layout>
  );
};

export async function getInitialProps(ctx: NextPageContext) {
  try {
    const response = await fromApi(ctx).get('/api/profile');
    const profile: ProfileData = response.data?.profile ?? {};
    return { profile };
  } catch (error) {
    console.log({error})
    const { res } = ctx;
    const targetURL = '/auth/signin';
    if (res) {
      res.writeHead(307, { Location: targetURL });
      res.end();
    } else {
      window.location.href = targetURL;
      return Promise.resolve({ profile: {} });
    }
    return { profile: {} };
  }
}

Profile.getInitialProps = getInitialProps;

export default Profile;
