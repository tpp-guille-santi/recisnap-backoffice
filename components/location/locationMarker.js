import { Marker } from 'react-leaflet';
const LocationMarker = props => {
  return props.markerPosition === null ? null : (
    <Marker position={props.markerPosition} draggable={false}></Marker>
  );
};

export default LocationMarker;
