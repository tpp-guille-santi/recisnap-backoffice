'use client';
import { Marker } from 'react-leaflet';

const svgIcon = L.divIcon({
  html: `
  <svg width="99" height="122" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>map-marker</title>
  <desc>
    Created with Sketch.
  </desc>
  <g id="Vivid.JS" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="Vivid-Icons" transform="translate(-125.000000, -643.000000)">
      <g id="Icons" transform="translate(37.000000, 169.000000)">
        <g id="map-marker" transform="translate(78.000000, 468.000000)">
          <g transform="translate(10.000000, 6.000000)">
            <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" id="Shape" fill="#279632"/>
            <circle id="Oval" fill="#143017" fill-rule="nonzero" cx="14" cy="14" r="7"/>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>
`,
  className: 'svg-icon',
  iconSize: [24, 40],
  iconAnchor: [12, 40]
});

const LocationMarker = props => {
  return props.markerPosition === null ? null : (
    <Marker
      position={props.markerPosition}
      icon={svgIcon}
      draggable={false}
    ></Marker>
  );
};

export default LocationMarker;
