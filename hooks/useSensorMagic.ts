// import WebSocket from 'isomorphic-ws';
import { useEffect, useRef } from 'react';

const bias = 0.98;
const zeroBias = 0.02;
// const debugServer = new WebSocket('ws://192.168.1.2:8080');

const sensorOptions = { frequency: 50 };
export function useSensorMagic(callback: () => Promise<unknown>) {
  const gyro = useRef<Gyroscope>(new Gyroscope(sensorOptions));
  const accel = useRef<Accelerometer>(new Accelerometer(sensorOptions));
  const data = useRef({
    timestamp: null as number | null,
    alpha: 0,
    beta: 0,
    gamma: 0
  });

  const callbackd = useRef(false);

  const handleReading = () => {
    const $$ = data.current;
    const gy = gyro.current;
    const ax = accel.current;

    if (
      gy?.timestamp == null ||
      ax?.x == null ||
      ax?.y == null ||
      ax?.z == null ||
      gy?.x == null ||
      gy?.y == null ||
      gy?.z == null
    )
      return;

    const dt = $$.timestamp ? (gy.timestamp - $$.timestamp) / 1e3 : 0;
    $$.timestamp = gy?.timestamp ?? null;
    const norm = Math.sqrt(ax.x ** 2 + ax.y ** 2 + ax.z ** 2);
    const scale = Math.PI / 2;
    $$.alpha = (1 - zeroBias) * ($$.alpha + gy.z * dt);
    $$.beta = bias * ($$.beta + gy.x * dt) + (1.0 - bias) * ((ax.x * scale) / norm);
    $$.gamma = bias * ($$.gamma + gy.y * dt) + (1.0 - bias) * ((ax.y * -scale) / norm);

    if (Math.max(...[$$.alpha, $$.beta, $$.gamma].map(Math.abs)) > 0.803 && !callbackd.current) {
      callbackd.current = true;
      // debugServer.send(JSON.stringify($$));
      callback().then(() => {
        callbackd.current = false;
      });
    }
  };

  useEffect(() => {
    const gy = gyro.current;
    const ax = accel.current;
    const $$ = data.current;
    gy?.addEventListener('reading', handleReading);
    const int = setInterval(() => {
      $$.alpha = 0;
      $$.beta = 0;
      $$.gamma = 0;
      $$.timestamp = null;
    }, 1e3);
    return () => {
      gy?.removeEventListener('reading', handleReading);
      gy?.stop();
      ax?.stop();
      clearInterval(int);
    };
  }, []);

  const requestPermissions = async () => {
    const supported = {
      gyro: typeof Gyroscope !== 'undefined',
      accl: typeof Accelerometer !== 'undefined'
    };
    if (!supported.gyro || !supported.accl) {
      console.warn('[useSensorMagic]', "This browser doesn't support Gyroscope or Accelerometer APIs");
      return supported;
    }
    const results = await Promise.all([
      navigator.permissions.query({ name: 'gyroscope' }),
      navigator.permissions.query({ name: 'accelerometer' })
    ]);
    const [gyPerm, axPerm] = results.map(result => ['granted', 'prompt'].includes(result.state));
    gyro.current?.start();
    accel.current?.start();
    return { gyro: gyPerm, accl: axPerm };
  };

  return { requestPermissions };
}
