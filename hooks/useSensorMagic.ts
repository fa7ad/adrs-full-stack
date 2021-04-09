import { useEffect, useRef } from 'react';
import { KalmanFilter, State } from 'kalman-filter';

type Roll = number;
type Pitch = number;
export function useSensorMagic(callback: () => unknown) {
  const gyro = useRef<Gyroscope>();
  const accel = useRef<Accelerometer>();
  const rp = useRef<Tuple<Roll, Pitch>>([0, 0]);
  const pcRoll = useRef<State>();
  const pcPitch = useRef<State>();
  const rollkf = useRef(new KalmanFilter()).current;
  const pitchkf = useRef(new KalmanFilter()).current;

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
        const [roll, pitch] = rp.current;
        const [r, p] = (rp.current = [roll + x / 28, pitch - y / 28]);
        pcRoll.current = rollkf.filter({ previousCorrected: pcRoll.current, observation: [r] });
        pcPitch.current = pitchkf.filter({ previousCorrected: pcPitch.current, observation: [p] });
        if (Math.abs(pcRoll.current.mean[0]) >= 46 || Math.abs(pcPitch.current.mean[0]) >= 46) {
          pcPitch.current = undefined;
          pcRoll.current = undefined;
          callback();
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
      accel.current = new Accelerometer({ frequency: 60 });
      accel.current.addEventListener('reading', () => {
        const sens = accel.current as Accelerometer;
        if (!sens.x || !sens.y || !sens.z) return;
        const { x, y, z } = sens;

        const r = (Math.atan2(x, Math.sqrt(y * y + z * z)) * 180) / Math.PI;
        const p = (Math.atan2(y, Math.sqrt(x * x + z * z)) * 180) / Math.PI;
        pcRoll.current = rollkf.filter({ previousCorrected: pcRoll.current, observation: [r] });
        pcPitch.current = pitchkf.filter({ previousCorrected: pcPitch.current, observation: [p] });
        if (Math.abs(pcRoll.current.mean[0]) >= 46 || Math.abs(pcPitch.current.mean[0]) >= 46) {
          pcPitch.current = undefined;
          pcRoll.current = undefined;
          callback();
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
