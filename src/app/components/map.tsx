"use client";

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map as RGMMap,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyB7oWu4yowUgDp7v4TnLw6UD9nB0Vtpu5I";
const GOOGLE_MAPS_MAP_ID = "a21a32af6689039c8a9b011a";

const BOUNDS: Bounds = {
  north: 40.9,
  south: 40.54,
  east: -73.73,
  west: -74.1,
};

interface Props {
  ref?: Ref<PinMapHandle>;
  className: string;
  pins: Pin[];
  selectedPinID?: string | null;
  onPinClick?: (pinID: string) => void;
}

interface Pin {
  id: string;
  latitude: number;
  longitude: number;
  infoWindowContents: ReactNode;
}

interface PinMapHandle {
  panTo: (pinID: string) => void;
}

export function PinMap(props: Props) {
  const { className, pins, selectedPinID, onPinClick } = props;

  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <RGMMap
        className={className}
        mapId={GOOGLE_MAPS_MAP_ID}
        defaultBounds={getBounds(pins)}
        restriction={{ latLngBounds: BOUNDS }}
        mapTypeId="roadmap"
        mapTypeControl={false}
        streetViewControl={false}
        reuseMaps
      />
      {pins.map((pin) => (
        <MarkerWithInfoWindow
          key={pin.id}
          position={{ lat: pin.latitude, lng: pin.longitude }}
          onClick={() => onPinClick?.(pin.id)}
          onMouseEnter={() => setHoveredPin(pin.id)}
          onMouseLeave={() => {
            if (hoveredPin === pin.id) {
              setHoveredPin(null);
            }
          }}
          isOpen={pin.id === hoveredPin || pin.id === selectedPinID}
        >
          {pin.infoWindowContents}
        </MarkerWithInfoWindow>
      ))}
      <TransitLayer />
      <HandleConnector {...props} />
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

function MarkerWithInfoWindow(
  props: ComponentPropsWithoutRef<typeof AdvancedMarker> & { isOpen: boolean },
): ReactNode {
  const { children, isOpen, ...markerProps } = props;
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement>(null);
  return (
    <>
      <AdvancedMarker {...markerProps} ref={markerRef} />
      {isOpen && (
        <InfoWindow disableAutoPan anchor={markerRef.current} headerDisabled>
          {children}
        </InfoWindow>
      )}
    </>
  );
}

function HandleConnector(props: Props): ReactNode {
  const map = useMap();
  useImperativeHandle(
    props.ref,
    () => {
      return {
        panTo: (id: string) => {
          const pin = props.pins.find((pin) => pin.id === id);
          if (pin != null) {
            map?.panTo({ lat: pin.latitude, lng: pin.longitude });
          }
        },
      };
    },
    [map, props.pins],
  );
  return null;
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
