import fetch from 'cross-fetch';
import * as qs from 'querystringify';

const credentials = {
  username: Buffer.from('MDE0MDI3Mjg4NjQ=', 'base64').toString('ascii'),
  password: Buffer.from('dTlCQk1oYWZLbWFuRkw=', 'base64').toString('ascii')
};

export async function sendSMS(phone: string, text: string) {
  const query = qs.stringify(
    {
      number: phone,
      message: text,
      ...credentials
    },
    '?'
  );
  const res = await fetch(`http://66.45.237.70/api.php${query}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: '',
    redirect: 'follow'
  });
  return res.text();
}
