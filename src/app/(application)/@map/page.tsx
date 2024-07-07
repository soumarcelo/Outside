'use client'

import EventCard from "@/app/components/events/event-card";
import EventCardMobile from "@/app/components/events/event-card-mobile";
import { EventsHandlers, Map, Marker, MarkerClusterGroup, ZoomControl } from "@/app/components/map/map-components";
import Tooltip from "@/app/components/map/map-tooltip";
import ScrollBox from "@/app/components/scrollbox/scrollbox";
import { LocationData, LocationEventData } from "@/app/lib/definitions/data";
import { EventsSummaryProps } from "@/app/lib/definitions/props";
import { generateEventCardProps } from "@/app/lib/utils";
import { Map as LMap, LatLngExpression, LeafletEventHandlerFnMap } from "leaflet";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  // const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });
  const isMobileLandscape = !isPortrait && isTabletOrMobile;

  const [mapRef, setMapRef] = useState<LMap | null>(null);
  const [bBox, setbBox] = useState<string>("");
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [mainEvents, setMainEvents] = useState<LocationEventData[]>([]);
  const [eventCards, setEventCards] = useState<JSX.Element[]>([]);
  const [mobileEventCards, setMobileEventCards] = useState<JSX.Element[]>([]);
  const [cards, setCards] = useState<JSX.Element[]>([]);

  const updateMarkers = () => {
    const viewBounds = mapRef?.getBounds();
    if (viewBounds === undefined) return;
    const _bBox = viewBounds.toBBoxString();
    fetch(`/api/locations?bbox=${_bBox}`)
      .then((response) => {
        response.json()
          .then((_locations: LocationData[]) =>
            setLocations(_locations));
      }).catch((reason) => { console.log(reason) });
  };

  const updateMainEvents = () => {
    const viewBounds = mapRef?.getBounds();
    if (viewBounds === undefined) return;
    const _bBox = viewBounds.toBBoxString();
    fetch(`/api/main-events?bbox=${_bBox}`)
      .then((response) => {
        response.json()
          .then((_mainEvents: LocationEventData[]) =>
            setMainEvents(_mainEvents)
          ).catch((reason) => { console.log(reason) });
      }).catch((reason) => { console.log(reason) });
  };

  // Initializer
  useEffect(() => {
    if (mapRef === null) return;
    mapRef.whenReady(() => {
      updateMarkers();
      updateMainEvents();
    });
  }, [mapRef]);

  const controllersEventListener = useCallback(() => {
    if (pathname.match("search")) {
      const viewBounds = mapRef?.getBounds();
      if (viewBounds === undefined) return;
      const _bBox = viewBounds.toBBoxString();
      setbBox(_bBox);
      router.replace(`${pathname}?bbox=${_bBox}`);
      return;
    }
    updateMarkers();
    updateMainEvents();
  }, [mapRef, pathname]);

  // Pathname Handler
  useEffect(() => {
    if (!pathname.match("search")) {
      updateMarkers();
      updateMainEvents();
      return;
    }
    setMainEvents([]);

    const viewBounds = mapRef?.getBounds();
    if (viewBounds === undefined) return;
    const _bBox = viewBounds.toBBoxString();

    const splittedPathname = pathname.split("/");
    const query = splittedPathname[splittedPathname.length - 1];

    router.replace(`${pathname}?bbox=${_bBox}`);
    fetch(`/api/locations?q=${query}&bbox=${_bBox}`)
      .then(response =>
        response.json()
          .then((_locations: LocationData[]) => setLocations(_locations))
          .catch(reason => console.log(reason)))
      .catch(reason => console.log(reason));
  }, [pathname, bBox]);

  // Update main events from viewbounds
  useEffect(() => {
    const mobileCards: Array<JSX.Element> = [];
    const _eventCards: Array<JSX.Element> = [];
    const _cards = mainEvents.map((ev) => {
      const cardProps = generateEventCardProps(ev, () => {
        fetch(`/api/locations/${ev.locationId}`)
          .then((response) => {
            response.json()
              .then((location: LocationData) => {
                mapRef?.flyTo(location.position, mapRef.getMaxZoom());
                router.push(`/locations/${ev.locationId}/events/${ev.id}`);
              }).catch((reason) => { console.log(reason) });
          }).catch((reason) => { console.log(reason) });
      });
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

  // Search Params
  useEffect(() => {
    const position = searchParams.get("flyto");
    if (position === null) return;
    const parsedPosition: Array<Number> = position.split(",").map((item) => Number(item));
    mapRef?.flyTo(parsedPosition)
  }, [searchParams]);

  // Marker - Events Handlers
  const markerEventHandlers: (id: string, position: LatLngExpression) => LeafletEventHandlerFnMap = (id, position) => ({
    click: () => {
      if (mapRef === null) return;
      // if (currentQuery) setCurrentQuery(undefined);
      mapRef.flyTo(position);
      router.push(`/locations/${id}`)
    },
    mouseover: () => {
      // let eventsSummary: EventsSummaryProps | undefined;
      // if (currentQuery) eventsSummary = fetchEventsSumaryFromLocationWithQuery(id, currentQuery);
      // else eventsSummary = fetchEventsSumaryFromLocation(id);
      // setEventsSummary(eventsSummary);
    }
  });

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
                  //isDesktopOrLaptop && <Tooltip eventsSummary={eventsSummary} /> // eventHandlers={tooltipEventHandlers(l.id)}
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
    </div>
  );
}