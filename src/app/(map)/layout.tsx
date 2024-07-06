'use client'

import { createContext, useEffect, useState } from "react";
import { Map as LMap, LatLngBounds, LatLngExpression, LeafletEventHandlerFnMap } from "leaflet";
import { useMediaQuery } from "react-responsive";
import NavBar from "@/app/components/navbars/navbar-app";
import EventCard from "@/app/components/events/event-card";
import ScrollBox from "@/app/components/scrollbox/scrollbox";
import { Map, ZoomControl, Tooltip, Marker, MarkerClusterGroup, EventsHandlers } from "@/app/components/map/map-components";
import {
  fetchLocationsAtBounds,
  fetchMainEventsAtBounds,
  fetchEventsSumaryFromLocation,
  fetchLocationFromId,
  fetchEventsSumaryFromLocationWithQuery,
} from "@/app/lib/data";
import {
  EventsSummaryProps,
  MapContextProviderProps,
} from "@/app/lib/definitions/props";
import { LocationData, LocationEventData } from "@/app/lib/definitions/data";
import { useRouter } from "next/navigation";
import { generateEventCardProps } from "@/app/lib/utils";
import { Card, CardBody, ListGroup, ListGroupItem, Stack } from "react-bootstrap";
import EventCardMobile from "../components/events/event-card-mobile";

export const MapContext = createContext<MapContextProviderProps | null>(null);

export default function MapLayout({ children }) {
  const router = useRouter();

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });
  const isMobileLandscape = !isPortrait && isTabletOrMobile;

  const [mapRef, setMapRef] = useState<LMap | null>(null);
  const [viewBoundsRef, setViewBounds] = useState<LatLngBounds | undefined>(undefined);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [eventsSummary, setEventsSummary] = useState<EventsSummaryProps | undefined>(undefined);
  const [mainEvents, setMainEvents] = useState<LocationEventData[]>([]);
  const [eventCards, setEventCards] = useState<JSX.Element[]>([]);
  const [mobileEventCards, setMobileEventCards] = useState<JSX.Element[]>([]);
  const [cards, setCards] = useState<JSX.Element[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string | undefined>(undefined);

  const updateMarkers = () => {
    const viewBounds = mapRef?.getBounds();
    if (viewBounds === undefined) return;
    const locations = fetchLocationsAtBounds(viewBounds);
    setLocations(locations);
  };

  const updateMainEvents = () => {
    const viewBounds = mapRef?.getBounds();
    if (viewBounds === undefined) return;
    const events = fetchMainEventsAtBounds(viewBounds);
    setMainEvents(events);
  };

  // Initializer
  useEffect(() => {
    if (mapRef === null) return;
    mapRef.whenReady(() => {
      setViewBounds(mapRef?.getBounds());
      updateMarkers();
      updateMainEvents();
    });
  }, [mapRef]);

  // Controllers
  const controllersEventListener = () => {
    setViewBounds(mapRef?.getBounds());
    if (currentQuery) return;
    updateMarkers();
    updateMainEvents();
  };

  // Update main events from viewbounds
  useEffect(() => {
    const mobileCards : Array<JSX.Element> = [];
    const _eventCards : Array<JSX.Element> = [];
    const _cards = mainEvents.map((ev) => {
      const cardProps = generateEventCardProps(ev, () => {
        const location = fetchLocationFromId(ev.locationId);
        if (location === undefined) return;

        mapRef?.flyTo(location?.position, mapRef.getMaxZoom());
        router.push("/locations/" + ev.locationId + "/events/" + ev.id);
      })
      const mobileCard = <EventCardMobile key={`mobile_${cardProps.cardId}`} {...cardProps} />;
      const _eventCard = <EventCard key={cardProps.cardId} {...cardProps} />;

      mobileCards.push(mobileCard);
      _eventCards.push(_eventCard);

      if (isMobileLandscape) return mobileCard;
      return _eventCard;
    });

    setMobileEventCards(mobileCards);
    setEventCards(_eventCards);
    setCards(_cards);
  }, [mainEvents]);

  useEffect(() => {
    const _cards = isMobileLandscape ? mobileEventCards : eventCards;
    setCards(_cards);
  }, [isMobileLandscape]);

  // Marker - Events Handlers
  const markerEventHandlers: (id: string, position: LatLngExpression) => LeafletEventHandlerFnMap = (id, position) => ({
    click: () => {
      if (mapRef === null) return;
      if (currentQuery) setCurrentQuery(undefined);
      mapRef.flyTo(position);
      router.push("/locations/" + id)
    },
    mouseover: () => {
      let eventsSummary: EventsSummaryProps | undefined;
      if (currentQuery) eventsSummary = fetchEventsSumaryFromLocationWithQuery(id, currentQuery);
      else eventsSummary = fetchEventsSumaryFromLocation(id);
      setEventsSummary(eventsSummary);
    }
  });

  // // Tooltip - Events Handlers
  // const tooltipEventHandlers: (id: string) => LeafletEventHandlerFnMap = (id) => ({
  //   add: () => {
  //     // console.log("mouse over: " + id);
  //     // let eventsSummary: EventsSummaryProps | undefined;
  //     // if (currentQuery) eventsSummary = fetchEventsSumaryFromLocationWithQuery(id, currentQuery);
  //     // else eventsSummary = fetchEventsSumaryFromLocation(id);
  //     // setEventsSummary(eventsSummary);
  //   },
  //   // remove: () => ,
  // });

  const onNavbarQuery = (query: string) =>
    router.push("/search/" + encodeURIComponent(query));

  return (
    <div className="vw-100 vh-100">
      <div className="position-fixed">
        <Map
          ref={setMapRef}
          center={[-22.9142067, -43.1782511]}
          zoomControl={false} scrollWheelZoom={true} zoom={14}>
          <MarkerClusterGroup chunkedLoading spiderfyOnMaxZoom={true}>
            {locations.map((l) => (
              <Marker key={l.id} position={l.position} isHot={l.isHot} eventHandlers={markerEventHandlers(l.id, l.position)} >
                {
                  isDesktopOrLaptop && <Tooltip eventsSummary={eventsSummary} /> // eventHandlers={tooltipEventHandlers(l.id)}
                }
              </Marker>
            ))}
          </MarkerClusterGroup>
          <ZoomControl position="bottomright" />
          <EventsHandlers dragend={controllersEventListener} zoomend={controllersEventListener} />
        </Map>
      </div>
      <div className="position-fixed top-0 start-50 translate-middle-x">
        <ScrollBox id="main-events">
          {cards}
        </ScrollBox>
      </div>
      <div className="position-fixed bottom-0 start-0 p-2">
        <NavBar onQuery={onNavbarQuery} />
      </div>
      <MapContext.Provider value={{
        mapMaxZoom: mapRef?.getMaxZoom(),
        mapViewBounds: () => viewBoundsRef,
        mapFlyTo: (latLng, zoom, options) => mapRef?.flyTo(latLng, zoom, options),
        setLocations,
        setMainEvents,
        setCurrentQuery,
        updateMarkers,
        updateMainEvents
      }}>
        {children}
      </MapContext.Provider>
    </div>
  );
}