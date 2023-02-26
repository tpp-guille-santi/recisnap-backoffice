'use client';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarker from './locationMarker';
import { useCallback, useEffect } from 'react';
const CustomMap = props => {
  const markers = props.markers ?? [];

  const onClick = useCallback(
    e => {
      if (!!props.setMarkerPosition) {
        props.setMarkerPosition(e.latlng);
      }
    },
    [props.map]
  );

  useEffect(() => {
    if (!!props.map) {
      props.map.on('click', onClick);
      return () => {
        props.map.off('click', onClick);
      };
    }
  }, [props.map, onClick]);

  return (
    <MapContainer
      center={props.center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '37rem' }}
      ref={props.setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!!props.markerPosition && (
        <LocationMarker
          markerPosition={props.markerPosition}
          map={props.map}
        ></LocationMarker>
      )}
      {markers.forEach(markerPosition => (
        <LocationMarker
          markerPosition={markerPosition}
          map={props.map}
        ></LocationMarker>
      ))}
    </MapContainer>
  );
};

export default CustomMap;
