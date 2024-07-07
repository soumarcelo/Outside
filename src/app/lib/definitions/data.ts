import { LatLngTuple } from "leaflet";
import { DateTime } from "luxon";

export interface LocationEventData {
  id: string,
  name: string,
  startsAt: string,
  // position?: LatLngExpression,
  locationId?: string,
  isMain: boolean
}

export interface LocationData {
  id: string,
  position: LatLngTuple,
  isHot: boolean,
  events: Array<LocationEventData> //Deprecated attrib
}

export interface EventData extends LocationEventData {
  description: string,
  image: string,
  producer: string,
  address: string
}

export interface EventTicketAllotmentData {
  id: string,
  name: string,
  value: number,
  maxAmount: number
}

export interface DetailedEventData extends EventData {
  finishesAt: DateTime,
  ticketsAllotments: EventTicketAllotmentData[]
}