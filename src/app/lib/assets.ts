import { Icon } from "leaflet";

export const MainMarkerIcon: Icon = new Icon({
  iconUrl: "assets/icons/markers/main-event-80.png",
  iconSize: [60, 60],
  iconAnchor: [30, 60],
  popupAnchor: [0, 0],
  shadowUrl: "",
  shadowSize: [0, 0],
  shadowAnchor: [0, 0],
});

export const MarkerIcon: Icon = new Icon({
  iconUrl: "assets/icons/markers/event-80.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, 0],
  shadowUrl: "",
  shadowSize: [0, 0],
  shadowAnchor: [0, 0],
});
