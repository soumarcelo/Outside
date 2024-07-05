'use client'

import EventCard from "@/app/components/events/event-card";
import { fetchEventsFromQuery, fetchLocationsFromQuery } from "@/app/lib/data";
import { generateEventCardProps } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Stack } from "react-bootstrap";
import { MapContext } from "@/app/(map)/layout";
import { MapContextProviderProps } from "@/app/lib/definitions/props";

export default function Page({ params }) {
  const query = decodeURIComponent(params.query);

  const router = useRouter();
  const { 
    mapViewBounds,
    setLocations,
    setMainEvents,
    setCurrentQuery,
    updateMarkers,
    updateMainEvents
   } = useContext<MapContextProviderProps>(MapContext);
  const [showResults, setShowResults] = useState<boolean>(true);
  const [results, setResults] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    const viewBounds = mapViewBounds?.(); 
    if (viewBounds === undefined) return;
    const locationEvents = fetchLocationsFromQuery(query, viewBounds);
    setLocations(locationEvents);
    
    const queryResults = fetchEventsFromQuery(query, viewBounds);
    const cards = queryResults.map((ev) => {
      const cardProps = generateEventCardProps(ev, () => {
        router.push("/locations/" + ev.locationId + "/events/" + ev.id);
      })
      return <EventCard key={cardProps.cardId} {...cardProps} />
    });

    setResults(cards);
    setCurrentQuery(query);
    setMainEvents([]);
  }, [mapViewBounds?.()]);

  const eventsHandlers = {
    show: () => { },
    hide: () => setShowResults(false),
    exited: () => { 
      router.push("/");
      setCurrentQuery(undefined);
      updateMarkers();
      updateMainEvents();
     }
  };
  return (
    <Offcanvas
      backdrop={false}
      show={showResults}
      onShow={eventsHandlers.show}
      onHide={eventsHandlers.hide}
      onExited={eventsHandlers.exited}>
      <OffcanvasHeader closeButton>
        <OffcanvasTitle className="text-truncate">Results for {query}</OffcanvasTitle>
      </OffcanvasHeader>
      <OffcanvasBody>
          <Stack gap={3} className="mx-auto">
            {results}
          </Stack>
        </OffcanvasBody>
    </Offcanvas>
  );
}