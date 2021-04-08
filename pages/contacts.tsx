import * as yup from 'yup';
import clsx from 'clsx';
import { Edit } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { TextField } from 'formik-material-ui';
import { NextPage, NextPageContext } from 'next';
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { addIndex, assoc, compose, filter, map, omit, prop } from 'ramda';
import {
  Box,
  Button,
  Divider,
  Grid,
  Hidden,
  IconButton,
  LinearProgress,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';

import Layout from 'components/Layout';
import fromApi from 'lib/fromApi';

const getEdited = compose(map(omit(['editing'])), filter(prop('editing')) as Identity<ContactState[]>);

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
  },
  existingContact: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    position: 'relative',
    '& > *': {
      margin: theme.spacing(1, 0)
    }
  },
  contactEdit: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.9)',
    opacity: 0.2,
    transition: 'all 500ms ease',
    zIndex: 10,
    '&:hover': {
      opacity: 1,
      cursor: 'pointer'
    }
  }
}));

const contactSchema = yup.object({
  name: yup.string().when('$editing', (editing: boolean, schema: yup.StringSchema) => {
    if (editing) return schema.required('Name is required');
    return schema.notRequired();
  }),
  phone: yup
    .string()
    .when('$editing', (editing: boolean, schema: yup.StringSchema) => {
      if (editing) return schema.required('Phone is required');
      return schema.notRequired();
    })
    .matches(/^(?:\+?88)?(01[3-9]\d{8})?$/, 'Enter a valid phone number'),
  id: yup.number().nullable(),
  editing: yup.boolean().notRequired()
});

const validationSchema = yup.object({
  contacts: yup.array(contactSchema),
  newContact: contactSchema
});

const Contacts: NextPage<{} & Unpromise<ReturnType<typeof getInitialProps>>> = function Profile(props) {
  const router = useRouter();
  const classes = useStyles();

  const initialValues = {
    contacts: props.contacts?.map(ct => ({ ...ct, editing: false })) ?? [],
    newContact: {
      name: '',
      phone: '',
      id: null,
      editing: false
    }
  };

  const onSubmit = async (data: typeof initialValues, formApi: FormikHelpers<typeof initialValues>) => {
    const editedContacts = getEdited(data.contacts);
    if (editedContacts.length > 0) {
      const requests = map(contact => fromApi().put('/api/contacts', contact), editedContacts);
      await Promise.all(requests);
      const res = await fromApi()
        .get('/api/contacts')
        .catch(() => null);
      const contacts = res?.data?.contacts ?? data.contacts;
      formApi.setFieldValue('contacts', map(assoc('editing', false), contacts));
    }
    if (data.newContact.editing) {
      await fromApi().post('/api/contacts', omit(['id', 'editing'], data.newContact));
      const res = await fromApi()
        .get('/api/contacts')
        .catch(() => null);
      const contacts = res?.data?.contacts ?? data.contacts;
      formApi.setFieldValue('contacts', map(assoc('editing', false), contacts));
      formApi.setFieldValue('newContact', initialValues.newContact);
    }
  };

  return (
    <Layout title='Emergency Contacts'>
      <Paper className={classes.root}>
        <Typography component='h1' variant='h5' align='center' className={classes.heading}>
          Emergency Contacts
        </Typography>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ submitForm, isSubmitting, values, touched, setFieldValue }) => (
            <Form className={clsx(classes.form)}>
              <Grid container>
                <FieldArray
                  name='contacts'
                  render={() =>
                    addIndex<ContactState, React.ReactNode>(map)(
                      (ct, idx) => (
                        <Grid
                          item
                          key={ct.id}
                          xs={12}
                          component={Paper}
                          variant='outlined'
                          className={classes.existingContact}
                        >
                          {!ct.editing ? (
                            <Box className={classes.contactEdit} onClick={setContactEditable(setFieldValue, idx)}>
                              <IconButton>
                                <Edit />
                              </IconButton>
                            </Box>
                          ) : null}
                          <Field
                            component={TextField}
                            fullWidth
                            variant='outlined'
                            id={`contacts.${idx}.name`}
                            name={`contacts.${idx}.name`}
                            label='Full Name'
                            required
                            disabled={!ct.editing}
                          />
                          <Field
                            component={TextField}
                            fullWidth
                            variant='outlined'
                            id={`contacts.${idx}.phone`}
                            name={`contacts.${idx}.phone`}
                            label='Phone Number'
                            required
                            disabled={!ct.editing}
                          />
                        </Grid>
                      ),
                      values?.contacts ?? []
                    )
                  }
                />
              </Grid>
              <Divider />
              {values.newContact.editing && values.contacts.length < 3 ? (
                <>
                  <Field
                    component={TextField}
                    fullWidth
                    variant='outlined'
                    id='newContact.name'
                    name='newContact.name'
                    label='Full Name'
                    required
                  />
                  <Field
                    component={TextField}
                    fullWidth
                    variant='outlined'
                    id='newContact.phone'
                    name='newContact.phone'
                    label='Phone Number'
                    required
                  />
                  <Hidden smUp>
                    <Button
                      variant='contained'
                      color='primary'
                      size='large'
                      fullWidth
                      onClick={setNewContactEditing(setFieldValue)}
                    >
                      Choose Contact
                    </Button>
                  </Hidden>
                </>
              ) : (
                <Button
                  variant='contained'
                  color='primary'
                  size='large'
                  fullWidth
                  onClick={setNewContactEditing(setFieldValue)}
                >
                  Add New Contact
                </Button>
              )}
              {isSubmitting && <LinearProgress />}
              <br />
              {(touched.newContact || touched.contacts) && (
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
              )}
            </Form>
          )}
        </Formik>
      </Paper>
    </Layout>
  );
};

type FormikFieldValueSetter = (field: string, value: any, shouldValidate?: boolean | undefined) => void;

function setNewContactEditing(setFieldValue: FormikFieldValueSetter) {
  return async () => {
    const supported = 'contacts' in navigator && 'ContactsManager' in window;
    if (supported) {
      try {
        interface ContactData {
          name: string;
          tel: string[];
        }
        const futureNavigator = navigator as any;
        const [contact]: ContactData[] = await futureNavigator.contacts.select(['name', 'tel'], {
          multiple: false
        });
        setFieldValue('newContact.name', contact?.name ?? '');
        setFieldValue('newContact.phone', contact?.tel?.[0]?.replace(/[^0-9+]/g, '') ?? '');
      } catch (error) {
        console.log({ error });
      }
    }
    setFieldValue('newContact.editing', true);
  };
}

function setContactEditable(setFieldValue: FormikFieldValueSetter, index: number) {
  return () => setFieldValue(`contacts.${index}.editing`, true);
}

export async function getInitialProps(ctx: NextPageContext) {
  try {
    const response = await fromApi(ctx).get('/api/contacts');
    const contacts: ExistingContact[] = response.data?.contacts ?? {};
    return { contacts };
  } catch (error) {
    console.log({ error });
    const { res } = ctx;
    const targetURL = '/auth/signin';
    if (res) {
      res.writeHead(307, { Location: targetURL });
      res.end();
    } else {
      window.location.href = targetURL;
    }
    return Promise.resolve({ contacts: [] });
  }
}

Contacts.getInitialProps = getInitialProps;

export default Contacts;
