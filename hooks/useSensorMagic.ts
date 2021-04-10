// import WebSocket from 'isomorphic-ws';
import { useEffect, useRef } from 'react';

const alpha = 0.58;

type Roll = number;
type Pitch = number;
export function useSensorMagic(callback: (triggered?: boolean) => Promise<unknown>) {
  const gyro = useRef<Gyroscope>();
  const accel = useRef<Accelerometer>();
  const arp = useRef<Tuple<Roll, Pitch>>([0, 0]);
  const grp = useRef<Tuple<Roll, Pitch>>([0, 0]);
  const callbackd = useRef(false);

  const requestGyroPermission = async () => {
    const supported = typeof Gyroscope !== 'undefined';
    if (!supported) {
      console.warn('[useSensorMagic]', "This browser doesn't support Gyroscope APIs");
      return false;
    }
    const result = await navigator.permissions.query({ name: 'gyroscope' });
    const granted = result.state === 'granted' || result.state === 'prompt';
    if (granted) {
      gyro.current = new Gyroscope({ frequency: 28 });
      gyro.current.addEventListener('reading', () => {
        const sens = gyro.current as Gyroscope;
        if (!sens.x || !sens.y || !sens.z) return;
        const { x, y } = sens;
        const [roll, pitch] = grp.current;
        const [r, p] = (grp.current = [roll + x / 28, pitch - y / 28]);

        const finalRoll = alpha * r + (1 - alpha) * arp.current[0];
        const finalPitch = alpha * p + (1 - alpha) * arp.current[1];

        if (Math.abs(finalRoll) >= 46 || Math.abs(finalPitch) >= 46) {
          // debugServer.send(JSON.stringify({ gyro: [finalRoll, finalPitch], arp, grp }));
          if (!callbackd.current) {
            arp.current = grp.current = [0, 0];
            callback(callbackd.current).then(() => {
              setTimeout(() => {
                callbackd.current = false;
              }, 5e3);
            });
            callbackd.current = true;
          }
        }
      });
      gyro.current?.start();
    }
    return granted;
  };

  const requestAccelPermission = async () => {
    const supported = typeof Accelerometer !== 'undefined';
    if (!supported) {
      console.warn('[useSensorMagic]', "This browser doesn't support Accelerometer APIs");
      return false;
    }
    const result = await navigator.permissions.query({ name: 'accelerometer' });
    const granted = result.state === 'granted' || result.state === 'prompt';
    if (granted) {
      accel.current = new Accelerometer({ frequency: 28 });
      accel.current.addEventListener('reading', () => {
        const sens = accel.current as Accelerometer;
        if (!sens.x || !sens.y || !sens.z) return;
        const { x, y, z } = sens;

        const r = (Math.atan2(x, Math.sqrt(y * y + z * z)) * 180) / Math.PI;
        const p = (Math.atan2(y, Math.sqrt(x * x + z * z)) * 180) / Math.PI;

        arp.current = [r, p];

        const finalRoll = alpha * grp.current[0] + (1 - alpha) * arp.current[0];
        const finalPitch = alpha * grp.current[1] + (1 - alpha) * arp.current[1];

        if (Math.abs(finalRoll) >= 46 || Math.abs(finalPitch) >= 46) {
          // debugServer.send(JSON.stringify({ accel: [finalRoll, finalPitch], arp, grp }));
          if (!callbackd.current) {
            arp.current = grp.current = [0, 0];
            callback(callbackd.current).then(() => {
              setTimeout(() => {
                callbackd.current = false;
              }, 5e3);
            });
            callbackd.current = true;
          }
        }
      });
      accel.current?.start();
    }
    return granted;
  };

  useEffect(() => {
    const gy = gyro.current;
    const ax = accel.current;
    return () => {
      gy?.stop();
      ax?.stop();
    };
  }, []);

  const requestPermissions = async () => {
    const gyro = await requestGyroPermission();
    const accel = await requestAccelPermission();
    return { gyro, accel };
  };

  return { requestPermissions };
}
