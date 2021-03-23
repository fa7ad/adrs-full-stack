import { point } from '@turf/helpers';
import nearest from '@turf/nearest-point';

interface PoliceStation extends GeoJSON.Feature<GeoJSON.Point> {
  properties: {
    dmpId: string;
    Name: string;
    featureIndex: number;
    distanceToPoint: number;
    [prop: string]: any;
  };
}

let stations: GeoJSON.FeatureCollection<GeoJSON.Point> | undefined;

async function refreshStations() {
  const res = await fetch('/data/dmpLocs.geojson');
  const data: GeoJSON.FeatureCollection<GeoJSON.Point> = await res.json();
  stations = data;
  return data;
}

export async function findHelp([lng, lat]: Tuple<number, number>) {
  if (!stations) {
    await refreshStations();
  }
  const haystack = stations as GeoJSON.FeatureCollection<GeoJSON.Point>;

  const needle = point([lng, lat]);

  const result = nearest(needle, haystack) as PoliceStation;

  return result.properties;
}
