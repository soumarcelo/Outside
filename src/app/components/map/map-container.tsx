import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import "leaflet-defaulticon-compatibility";
import { MapContainer as LMapContainer, TileLayer } from 'react-leaflet'
import { MapProps } from '@/app/lib/definitions/props';

export default function MapContainer({ mapRef, children, ...props }: MapProps) {
  return (
    <LMapContainer ref={mapRef} {...props}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}@2x.png?key=M6Yf1vzXcnkSnUeZvbcH"
        crossOrigin={true}
        minZoom={1}
        tileSize={512}
        zoomOffset={-1} />
      {children}
    </LMapContainer>
  );
}