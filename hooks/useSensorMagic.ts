import { useEffect, useRef, useState } from 'react';
import { KalmanFilter, State } from 'kalman-filter';

type Yaw = number;
type Roll = number;
type Pitch = number;

type GyroObservation = Tuple3<Yaw, Roll, Pitch>;
type AccelObservation = Tuple<Roll, Pitch>;

export function useSensorMagic(callback: () => unknown) {
  const gyro = useRef<Gyroscope>();
  const accel = useRef<Accelerometer>();
  const [rp, setRp] = useState<AccelObservation>([0, 0]);
  const [yrp, setYrp] = useState<GyroObservation>([0, 0, 0]);
  const pcRoll = useRef<State>();
  const pcPitch = useRef<State>();
  const rollkf = new KalmanFilter();
  const pitchkf = new KalmanFilter();

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
        const { x, y, z } = sens;
        setYrp(([yaw, roll, pitch]) => [yaw + y / 28, roll + x / 28, pitch - z / 28]);
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

        setRp([
          (Math.atan2(x, Math.sqrt(y * y + z * z)) * 180) / Math.PI,
          (Math.atan2(y, Math.sqrt(x * x + z * z)) * 180) / Math.PI
        ]);
        accel.current?.start();
      });
    }
    return granted;
  };

  const requestPermissions = async () => {
    const gyro = await requestGyroPermission();
    const accel = await requestAccelPermission();
    return { gyro, accel };
  };

  useEffect(() => {
    const gyInst = gyro.current;
    const axInst = accel.current;
    return () => {
      gyInst?.stop();
      axInst?.stop();
    };
  }, []);

  useEffect(() => {
    const [, r, p] = yrp;
    pcRoll.current = rollkf.filter({ previousCorrected: pcRoll.current, observation: [r] });
    if (Math.abs(pcRoll.current.mean[0]) >= 46) callback();
    pcPitch.current = pitchkf.filter({ previousCorrected: pcPitch.current, observation: [p] });
    if (Math.abs(pcPitch.current.mean[0]) >= 46) callback();
    console.log('yrp', { roll: pcRoll.current.mean, pitch: pcPitch.current.mean });
  }, [yrp]);

  useEffect(() => {
    const [r, p] = rp;
    pcRoll.current = rollkf.filter({ previousCorrected: pcRoll.current, observation: [r] });
    if (Math.abs(pcRoll.current.mean[0]) >= 46) callback();
    pcPitch.current = pitchkf.filter({ previousCorrected: pcPitch.current, observation: [p] });
    if (Math.abs(pcPitch.current.mean[0]) >= 46) callback();
    console.log('rp', { roll: pcRoll.current.mean, pitch: pcPitch.current.mean });
  }, [rp]);

  return { requestPermissions };
}
