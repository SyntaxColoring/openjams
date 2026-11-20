"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map as RGMMap,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useLayoutEffect } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyB7oWu4yowUgDp7v4TnLw6UD9nB0Vtpu5I";
const GOOGLE_MAPS_MAP_ID = "DEMO_MAP_ID";

const BOUNDS: Bounds = {
  north: 40.9,
  south: 40.54,
  east: -73.73,
  west: -74.05,
};

export interface Pin {
  id: string;
  latitude: number;
  longitude: number;
}

interface Props {
  pins: Pin[];
}

export function Map(props: Props) {
  const { pins } = props;
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <RGMMap
        mapId={GOOGLE_MAPS_MAP_ID}
        style={{ height: 500, width: 500 }}
        defaultBounds={getBounds(pins)}
        restriction={{ latLngBounds: BOUNDS }}
        mapTypeId="roadmap"
        mapTypeControl={false}
        streetViewControl={false}
        reuseMaps
      />
      {pins.map((pin) => (
        <AdvancedMarker
          key={pin.id}
          position={{ lat: pin.latitude, lng: pin.longitude }}
        />
      ))}
      <TransitLayer />
    </APIProvider>
  );
}

// https://github.com/visgl/react-google-maps/discussions/440
function TransitLayer() {
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");
  useLayoutEffect(() => {
    if (map && mapsLib) {
      const transitLayer = new mapsLib.TransitLayer();
      transitLayer.setMap(map);
      return () => {
        transitLayer.setMap(null);
      };
    }
  }, [map, mapsLib]);
  return <></>;
}

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

function getBounds(pins: Pin[]): Bounds {
  if (pins.length > 0) {
    const longitudes = pins.map((p) => p.longitude);
    const latitudes = pins.map((p) => p.latitude);
    return {
      north: Math.max(...latitudes),
      south: Math.min(...latitudes),
      east: Math.max(...longitudes),
      west: Math.min(...longitudes),
    };
  } else {
    return BOUNDS;
  }
}
