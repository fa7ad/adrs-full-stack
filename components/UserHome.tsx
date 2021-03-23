import Link from 'next/link';
import { useEffect } from 'react';
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
    padding: theme.spacing(1)
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
  const { position, supported, trigger } = useGeolocation();

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
    if (!position) return;
    import('utils/findHelp').then(m => m.findHelp(position)).then(data => setArea(data.dmpId));
  }, [position]);

  return (
    <>
      <Grid container spacing={2} className={classes.infoGrid}>
        <Grid item xs={6} component='section'>
          <Paper variant='outlined' className={classes.profile}>
            {/* <img className='profile__picture' src={personImg} alt='' /> */}
            <Typography component='p' variant='body2'>
              <b>Name: </b>John Doe
            </Typography>
            <Typography component='p' variant='body2'>
              <b>Driving License Number: </b>9126189361
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} component='section'>
          <Paper variant='outlined' className={classes.emergency}>
            <Link href='/contacts'>
              <IconButton className={classes.editIcon}>
                <EditIcon />
              </IconButton>
            </Link>
            <Typography component='p' variant='body1'>
              Emergency Contact
            </Typography>
            <Typography component='p' variant='body2'>
              <b>Name: </b>Jane Doe
            </Typography>
            <Typography component='p' variant='body2'>
              <b>Phone Number: </b> +8801701227057
            </Typography>
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
        {supported && (
          <Button variant='outlined' color='primary' size='large' onClick={trigger}>
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
