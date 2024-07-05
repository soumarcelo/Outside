'use client'

import EventCard from "@/app/components/events/event-card";
import { fetchEventsFromLocation } from "@/app/lib/data";
import { LocationEventData } from "@/app/lib/definitions/data";
import { generateEventCardProps } from "@/app/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Stack } from "react-bootstrap";

export default function Page({params}) {
  const locationId = params["location-id"];

  const router = useRouter();
  const pathname = usePathname();
  const [showEvents, setShowEvents] = useState<boolean>(true);
  const [events, setEvents] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const locationEvents: LocationEventData[] = fetchEventsFromLocation(locationId);
    const cards = locationEvents.map((ev) => {
      const cardProps = generateEventCardProps(ev, () => {
        router.push(pathname + "/events/" + ev.id);
      })
      return <EventCard key={cardProps.cardId} {...cardProps} />
    });
    setEvents(cards);
  }, []);

  const eventsHandlers = {
    show: () => {},
    hide: () => {setShowEvents(false)},
    exited: () => {router.push("/")}
  };

  return (
    <Offcanvas
        backdrop={false}
        show={showEvents}
        onShow={eventsHandlers.show}
        onHide={eventsHandlers.hide}
        onExited={eventsHandlers.exited}>
        <OffcanvasHeader closeButton>
          <OffcanvasTitle className="text-truncate">Current Events</OffcanvasTitle>
        </OffcanvasHeader>
        <OffcanvasBody>
          <Stack gap={3} className="mx-auto">
            {events}
          </Stack>
        </OffcanvasBody>
      </Offcanvas>
  );
}