import { Marker } from 'react-leaflet';

const LocationMarker = ({ markerPosition, onClick, instruction }) => {
  const clickedMarker = () => {
    if (onClick && instruction) {
      return onClick(instruction);
    }
  };

  const getIcon = () => {
    const source = instruction ? instruction.material_name : 'default';
    return new L.Icon({
      iconUrl: `static/images/${source}.svg`,
      iconSize: [40, 40],
      iconAnchor: [12, 40]
    });
  };

  return markerPosition === null ? null : (
    <Marker
      position={markerPosition}
      icon={getIcon()}
      draggable={false}
      eventHandlers={{
        click: clickedMarker
      }}
    ></Marker>
  );
};

export default LocationMarker;
