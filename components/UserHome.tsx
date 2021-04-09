import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import ExploreIcon from '@material-ui/icons/Explore';

import { useDmpData } from 'hooks/useDmpData';
import useGeolocation from 'hooks/useGeolocation';

import safeRenderHtml from 'utils/safeRender';
import { createEmergencyAlert } from 'utils/createEmergencyAlert';
import fromApi from 'lib/fromApi';
import { map } from 'ramda';
import { useSensorMagic } from 'hooks/useSensorMagic';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2, 0)
  },
  select: {
    marginRight: theme.spacing(2)
  },
  infoGrid: {
    margin: theme.spacing(1, -1)
  },
  policeInfo: {
    '& > div > div:first-child': {
      display: 'none'
    }
  },
  location: {
    display: 'flex'
  },
  emergency: {
    height: '100%',
    padding: theme.spacing(1),
    position: 'relative'
  },
  profile: {
    height: '100%',
    padding: theme.spacing(1),
    position: 'relative'
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: theme.typography.body2.fontSize,
    padding: theme.spacing(1)
  }
}));

function UserHome() {
  const classes = useStyles();
  const { area, setArea, areas, policeInfo, phoneNums } = useDmpData();
  const showAccidentAlert = createEmergencyAlert(phoneNums);
  const {
    position: geoPos,
    supported: geoSupported,
    trigger: triggerGeo,
    requestPermission: requestGeoPermission
  } = useGeolocation();
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    drivingLicense: '',
    nidNumber: '',
    dob: undefined as string | undefined
  });
  const [contacts, setContacts] = useState<ExistingContact[]>([]);
  const { requestPermissions: requestSensorPermissions } = useSensorMagic(showAccidentAlert);
  const router = useRouter();

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === '+') showAccidentAlert();
  };

  const handleManualReport: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    showAccidentAlert();
  };

  useEffect(() => {
    document.body.addEventListener('keypress', handleKeyPress);
    return () => {
      document.body.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (!geoPos) return;
    import('utils/findHelp').then(m => m.findHelp(geoPos)).then(data => setArea(data.dmpId));
  }, [geoPos]);

  useEffect(() => {
    (async () => {
      const profRes = await fromApi().get('/api/profile');
      if (profRes?.data?.profile === null) {
        router.push('/profile');
        return;
      }
      setProfile(profRes?.data?.profile);
    })();
  }, [setProfile]);

  useEffect(() => {
    (async () => {
      const contRes = await fromApi().get('/api/contacts');
      setContacts(contRes?.data?.contacts);
    })();
  }, [setContacts]);

  useEffect(() => {
    requestGeoPermission().then(permitted => {
      if (permitted) return triggerGeo();
      alert('GPS access is required for this app!');
    });
  }, [triggerGeo, requestGeoPermission]);
  useEffect(() => {
    requestSensorPermissions().then(permitted => {
      if (permitted.accel && permitted.gyro) return;
      alert('Gyroscope and Accelerometer access are required for this app!');
    });
  }, [requestSensorPermissions]);

  return (
    <>
      <Grid container spacing={2} className={classes.infoGrid}>
        <Grid item sm={6} xs={12} component='section'>
          <Paper variant='outlined' className={classes.profile}>
            <Link href='/profile'>
              <IconButton className={classes.editIcon}>
                <EditIcon />
              </IconButton>
            </Link>
            <Typography component='p' variant='body2'>
              <b>Name: </b>
              {profile.name}
            </Typography>
            <Typography component='p' variant='body2'>
              <b>Driving License Number: </b>
              {profile.drivingLicense}
            </Typography>
          </Paper>
        </Grid>
        <Grid item sm={6} xs={12} component='section'>
          <Paper variant='outlined' className={classes.emergency}>
            <Link href='/contacts'>
              <IconButton className={classes.editIcon}>
                <EditIcon />
              </IconButton>
            </Link>
            <Typography component='p' variant='body1'>
              Emergency Contact
            </Typography>
            {map(
              cont => (
                <Typography component='p' variant='body2' key={cont.phone}>
                  <b>{cont.name}</b> // {cont.phone}
                </Typography>
              ),
              contacts
            )}
          </Paper>
        </Grid>
      </Grid>
      <section className={classes.location}>
        <FormControl variant='outlined' fullWidth className={classes.select}>
          <InputLabel id='area-select-label'>Area</InputLabel>
          <Select
            name='area'
            id='area'
            labelId='area-select-label'
            onChange={evt => {
              setArea(evt.target.value as string);
            }}
            value={area}
            label='Area'
          >
            {areas.map(({ value, label }) => (
              <MenuItem value={value} key={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {geoSupported && (
          <Button variant='outlined' color='primary' size='large' onClick={triggerGeo}>
            <ExploreIcon />
          </Button>
        )}
      </section>
      <Box component='section' className={classes.policeInfo}>
        {safeRenderHtml(policeInfo || 'Loading...')}
      </Box>
      <Button
        variant='contained'
        color='secondary'
        size='large'
        fullWidth
        className='mt-4'
        onClick={handleManualReport}
      >
        Manually Report Accident!
      </Button>
    </>
  );
}

export default UserHome;
