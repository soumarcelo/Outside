'use client'

import { LeafletEventHandlerFnMap } from 'leaflet';
import dynamic from 'next/dynamic';
import { LegacyRef, forwardRef } from 'react';
import { MapContainerProps, useMapEvents } from 'react-leaflet';

const LMap = dynamic(() => import("@/app/components/map/map-container"), {
  ssr: false,
  loading: () => (
    <div className="d-flex align-items-center justify-content-center vw-100 vh-100">
      <div className="spinner-grow text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ),
});
export const Map = forwardRef((props : MapContainerProps, ref : LegacyRef<L.Map>) => <LMap {...props} mapRef={ref} />);

export const ZoomControl = dynamic(() => import("react-leaflet").then((m) => m.ZoomControl), { ssr: false });
// export const Control = dynamic(() => import("react-leaflet-custom-control"), { ssr: false });
export const MarkerClusterGroup = dynamic(() => import("react-leaflet-cluster"), {ssr: false});
export const Marker = dynamic(() => import("@/app/components/map/map-marker"), {ssr: false});
export const Tooltip = dynamic(() => import("@/app/components/map/map-tooltip"), {ssr: false});
export const Popup = dynamic(() => import("@/app/components/map/map-popup"), {ssr: false});

export function EventsHandlers(props : LeafletEventHandlerFnMap) {
  useMapEvents(props);
  return null;
}