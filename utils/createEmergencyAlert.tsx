import { Fragment } from 'react';
import { Button, Divider, Grid, Typography } from '@material-ui/core';
import Alert from 'utils/alert';
import fromApi from 'lib/fromApi';

export function createEmergencyAlert(
  phoneNums: string[],
  contacts?: ContactsData[],
  locationHelpers?: { position: Tuple<number, number> | null; trigger: () => unknown }
) {
  return (isVisible?: boolean) => {
    locationHelpers?.trigger();
    if (isVisible) return Promise.resolve({});
    return Alert.fire({
      timer: 20e3,
      icon: 'warning',
      title: (
        <Typography variant='body1' component='span'>
          Accident Detected!
        </Typography>
      ),
      html: (
        <>
          <div className='text-md'>
            If this was a mistake, click cancel. Incident will be atomatically reported if not cancelled. Your local
            Police station number is{' '}
            <a href={`tel:${phoneNums[0]}`}>
              <strong>{phoneNums[0]}</strong>
            </a>
          </div>
          <br />
          Other DMP numbers: <br />
          {phoneNums.slice(1).map(num => (
            <Fragment key={num}>
              <a href={`tel:${num}`}>
                <b>{num}</b>
              </a>
              <br />
            </Fragment>
          ))}
          <Divider />
          <Typography variant='body2' component='p'>
            Call Emergency Services
          </Typography>
          <Grid container justify='center' spacing={2}>
            {phoneNums.map(num => (
              <Grid item xs component='a' key={num} href={`tel:${num}`}>
                <Button variant='contained' color='primary'>
                  Call {num}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Divider style={{ margin: '0.5em 0' }} />
          <p className='text-sm'>Emergency Contact</p>
          <Grid container justify='center'>
            {contacts?.map(ct => (
              <Grid item xs component='a' href={`tel:${ct.phone}`} key={ct.phone}>
                <Button variant='contained' color='secondary'>
                  Call {ct.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      ),

      showCancelButton: true,
      showConfirmButton: false,
      timerProgressBar: true,
      allowOutsideClick: false
    }).then(val => {
      if (val.dismiss === Alert.DismissReason.timer) {
        fromApi().post('/api/notify', { position: locationHelpers?.position, phoneNums });
        const els = phoneNums.map(num => `<a href="tel:${num}"><b>${num}</b></a>`).join('<br />');
        const el$ = document.createElement('div');
        el$.innerHTML = els;
        const pols = el$.querySelectorAll('a');
        pols[0].click();
        pols.forEach(number => setTimeout(() => number.click(), 15e3));
      }
    });
  };
}
