import { LatLngExpression } from "leaflet"
import { DateTime } from "luxon";
import { MarkerProps, PopupProps, TooltipProps } from "react-leaflet"

export interface LocationsEventsSummary {
  id: string,
  nextEventName: string,
  nextEventDay: string | number,
  nextEventMonth: string | number,
  remainingEventsCount?: number
}

export interface LocationData {
  id: string,
  position: LatLngExpression,
  isHot: boolean,
  events: Array<LocationEvent> //Deprecated attrib
}

export interface MapDataEvent {
  id: string,
  position: LatLngExpression,
  isMainEvent: boolean,
  eventName: string,
  eventDay: string | number,
  eventMonth: string | number,
}

export interface EventCardProps {
  cardId: string,
  eventImageURL: string,
  eventName: string
  eventDay: string | number,
  eventMonth: string | number,
  onClick: () => void
}

export interface MainEventsAtData { //DEPRECATED
  events: Array<EventCardProps>
}

export interface MarkerData extends MarkerProps {
  isHot: boolean
}

export interface TooltipData extends TooltipProps {
  eventsSummary?: LocationsEventsSummary
}

export interface PopUpData extends PopupProps {
  onSelectEvent?: (ev :LocationEvent) => void,
  events: Array<LocationEvent>
}

export interface OffcanvasFnEventsHandlers {
  hide: () => void,
  show: () => void,
  showDetails: () => void,
}

export interface OffcanvasProps {
  id?: string,
  show: boolean,
  event: EventData | null,
  eventsHandlers: OffcanvasFnEventsHandlers
}