import { MarkerLocationProps } from "@/app/lib/definitions/props";
import { Icon } from "leaflet";
import { Marker } from "react-leaflet";

const MarkerIcon: Icon = new Icon({
  iconUrl: "/assets/icons/markers/location-80.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [1, -22],
  shadowUrl: "",
  shadowSize: [0, 0],
  shadowAnchor: [0, 0],
  tooltipAnchor: [1, -26],
});

const HotMarkerIcon: Icon = new Icon({
  iconUrl: "/assets/icons/markers/hot-location-80.png",
  iconSize: [60, 60],
  iconAnchor: [30, 60],
  popupAnchor: [1, -32],
  shadowUrl: "",
  shadowSize: [0, 0],
  shadowAnchor: [0, 0],
  tooltipAnchor: [1, -40],
});

export default function MarkerCommon({ position, children, isHot, ...props }: MarkerLocationProps) {
  return (
    <Marker position={position} icon={isHot ? HotMarkerIcon : MarkerIcon} {...props}>
      {children}
    </Marker>
  );
}