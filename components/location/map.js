'use client';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarker from './locationMarker';
import { useCallback, useEffect } from 'react';

function CustomMap({
  instructions,
  setMarkerPosition,
  map,
  setMap,
  center,
  markerPosition,
  style,
  onMarkerClick
}) {
  const onClick = useCallback(
    e => {
      if (!!setMarkerPosition) {
        setMarkerPosition(e.latlng);
      }
    },
    [map]
  );

  useEffect(() => {
    if (!!map) {
      map.on('click', onClick);
      return () => {
        map.off('click', onClick);
      };
    }
  }, [map, onClick, instructions]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={style}
      ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!!markerPosition && (
        <LocationMarker
          markerPosition={markerPosition}
          map={map}
        ></LocationMarker>
      )}
      {!!instructions &&
        instructions.map((instruction, index) => (
          <LocationMarker
            key={index}
            markerPosition={[instruction.lat, instruction.lon]}
            map={map}
            onClick={onMarkerClick}
            instruction={instruction}
          />
        ))}
    </MapContainer>
  );
}

export default CustomMap;
