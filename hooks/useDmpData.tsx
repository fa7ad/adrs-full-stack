import { unstable_batchedUpdates } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';

export function useDmpData() {
  const [area, setArea] = useState<string>('');
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [dmpData, setDmpData] = useState<Record<string, string>>({});

  const policeInfo = dmpData?.[area] ?? null;
  const phoneNums = useMemo(() => {
    if (!policeInfo) return ['999'];
    return (
      policeInfo
        ?.match(/(?:Cell:[^0-9+]+)([0-9+]+)/g)
        ?.map(num => num.replace(/[^0-9+]/g, ''))
        ?.concat('999') ?? ['999']
    );
  }, [policeInfo]);

  useEffect(() => {
    fetch('/data/dmpInfo.json')
      .then(res => res.json())
      .then((dmpData: Record<string, string>) => {
        const areas = Object.keys(dmpData).map(value => ({
          label: value.replace(/^(\w)|\W(\w)/g, g => g.toUpperCase()),
          value
        }));
        unstable_batchedUpdates(() => {
          setAreas(areas);
          setArea(areas[0].value);
          setDmpData(dmpData);
        });
      });
  }, [setAreas, setDmpData]);

  return { area, areas, dmpData, setArea, policeInfo, phoneNums };
}
