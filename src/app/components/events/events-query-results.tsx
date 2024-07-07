'use client'

import EventCard from "@/app/components/events/event-card";
import { generateEventCardProps } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Stack } from "react-bootstrap";
import { LocationEventData } from "@/app/lib/definitions/data";

export default function EventsQueryResults({ query, queryResults }) {
  const router = useRouter();
  const [showResults, setShowResults] = useState<boolean>(true);
  const [results, setResults] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    const cards = queryResults.map((ev : LocationEventData) => {
      const cardProps = generateEventCardProps(ev, () => {
        router.push("/locations/" + ev.locationId + "/events/" + ev.id);
      })
      return <EventCard key={cardProps.cardId} {...cardProps} />
    });

    setResults(cards);
  }, [queryResults]);

  const eventsHandlers = {
    show: () => { },
    hide: () => setShowResults(false),
    exited: () => router.push("/")
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