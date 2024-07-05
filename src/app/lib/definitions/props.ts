import { MapContainerProps, MarkerProps, PopupProps, TooltipProps } from "react-leaflet"
import { DetailedEventData, EventData, EventTicketAllotmentData, LocationData, LocationEventData } from "./data"
import { LatLngBounds, LatLngExpression, Map, ZoomPanOptions } from "leaflet"
import { Dispatch, LegacyRef, MutableRefObject, SetStateAction } from "react"

export interface EventsSummaryProps {
  id: string,
  nextEventName: string,
  nextEventDay: number,
  nextEventMonth: number,
  remainingEventsCount?: number
}

export interface EventItemProps {
  eventName?: string,
  eventDay?: number,
  eventMonth?: number
}

export interface MapProps extends MapContainerProps {
  mapRef?: LegacyRef<Map>
}

export interface TooltipLocationEventsProps extends TooltipProps {
  eventsSummary?: EventsSummaryProps
}

export interface PopupLocationEventProps extends PopupProps {
  onSelectEvent?: (ev : LocationEventData) => void,
  events: Array<LocationEventData>
}

export interface MarkerLocationProps extends MarkerProps {
  isHot: boolean
}

export interface MapContextProviderProps {
  mapViewBounds?: () => LatLngBounds | undefined,
  mapMaxZoom?: number,
  mapFlyTo?: (latlng: LatLngExpression, zoom?: number, options?: ZoomPanOptions) => L.Map | undefined,
  setLocations: Dispatch<SetStateAction<LocationData[]>>,
  setMainEvents: Dispatch<SetStateAction<LocationEventData[]>>,
  setCurrentQuery: Dispatch<SetStateAction<string | undefined>>,
  updateMarkers: () => void,
  updateMainEvents: () => void,
}

export interface EventCardProps {
  cardId: string,
  eventImageURL: string,
  eventName: string
  eventDay: string | number,
  eventMonth: string | number,
  onClick: () => void
}

export interface EventFnEventsHandlers {
  hide: () => void,
  show: () => void,
}

export interface EventProps {
  id?: string,
  show: boolean,
}

export interface SummarizedEventFnEventsHandlers extends EventFnEventsHandlers {
  showDetails: () => void,
  showAddress: () => void,
}

export interface SummarizedEventProps extends EventProps {
  event?: EventData,
  eventsHandlers: SummarizedEventFnEventsHandlers
}

export interface SelectedTicketsProps {
  [Key: string]: TicketAllotmentSummaryProps
}

export interface DetailedEventFnEventsHandlers extends EventFnEventsHandlers {
  close: () => void,
  buyTickets: (selectedTickets : SelectedTicketsProps) => void
}

export interface DetailedEventProps extends EventProps {
  event?: DetailedEventData,
  eventsHandlers: DetailedEventFnEventsHandlers
}

export interface EventTicketAllotmentProps {
  ticketAllotment: EventTicketAllotmentData,
  amount: number,
  onDecrementAmount: () => void,
  onIncrementAmount: () => void
}

export interface TicketAllotmentSummaryProps {
  allotmentName: string,
  amount: number,
  allotmentValue: number
}