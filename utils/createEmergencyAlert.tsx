import { Fragment, MutableRefObject } from 'react';
import { Button, Typography } from '@material-ui/core';
import Alert from 'utils/alert';

export function createEmergencyAlert(phoneNums: string[], isVisible: MutableRefObject<boolean>) {
  return () => {
    if (!isVisible.current)
      Alert.fire({
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
              If this was a mistake, click cancel.
              <br />
              Incident will be atomatically reported if not cancelled.
              <br />
              Your local Police station number is{' '}
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
            <hr className='my-2' />
            <p className='text-sm'>Call Police</p>
            <section className='reporting -px-1'>
              {phoneNums.map(num => (
                <a key={num} href={`tel:${num}`} className='p-1'>
                  <Button variant='contained' color='primary'>
                    Call {num}
                  </Button>
                </a>
              ))}
            </section>
            <hr className='my-2' />
            <p className='text-sm'>Emergency Contact</p>
            <section className='reporting -px-1'>
              <a href='tel:+8801701227057' className='p-1'>
                <Button variant='contained' color='secondary'>
                  Call Emergency Contact
                </Button>
              </a>
              <a href='tel:+8801701227057' className='p-1'>
                <Button variant='contained' color='secondary'>
                  Text Emergency Contact
                </Button>
              </a>
            </section>
          </>
        ),

        showCancelButton: true,
        showConfirmButton: false,
        timerProgressBar: true,
        allowOutsideClick: false
      }).then(val => {
        if (val.dismiss === Alert.DismissReason.timer) {
          const els = phoneNums.map(num => `<a href="tel:${num}"><b>${num}</b></a>`).join('<br />');
          const el$ = document.createElement('div');
          el$.innerHTML = els;
          const pols = el$.querySelectorAll('a');
          pols[0].click();
          pols.forEach(number => setTimeout(() => number.click(), 15e3));
        } else {
          isVisible.current = false;
        }
      });
  };
}
