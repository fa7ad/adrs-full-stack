import { useState } from 'react';

export default function useGeolocation() {
  const [position, setLocation] = useState<Tuple<number, number> | null>(null);
  let supported = true;
  const trigger = () => {
    supported = !!navigator.geolocation;
    if (!supported) {
      console.warn('[useGeolocation]', "This browser doesn't support Geolocation APIs");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => setLocation([position.coords.longitude, position.coords.latitude]),
      () => setLocation(null)
    );
  };

  return { position, trigger, supported };
}
