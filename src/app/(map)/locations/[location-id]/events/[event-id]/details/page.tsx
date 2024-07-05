'use client'

import DetailedEvent from "@/app/components/events/event-detailed";
import { fetchDetailedEventData, fetchEventData } from "@/app/lib/data";
import { DetailedEventData } from "@/app/lib/definitions/data";
import { SelectedTicketsProps } from "@/app/lib/definitions/props";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export default function Page({ params }) {
  const eventId = params["event-id"];

  const router = useRouter();
  const [showDetailedEvent, setShowDetailedEvent] = useState<boolean>(true);
  const [currentEvent, setCurrentEvent] = useState<DetailedEventData | undefined>(undefined);

  useEffect(() => {
    const event = fetchDetailedEventData(eventId);
    setCurrentEvent(event);
  }, []);

  const eventsHandlers = {
    show: () => { },
    hide: () => {
      setShowDetailedEvent(false);
      router.back();
    },
    close: () => {
      setShowDetailedEvent(false);
      router.back();
    },
    buyTickets: (selectedTickets: SelectedTicketsProps) => {
      if (currentEvent === null) return;
      console.log(currentEvent?.id);
      console.log(selectedTickets);
      const checkoutId = v4();
      router.push("/checkout/" + checkoutId);
    },
  };

  return (
    <DetailedEvent
      show={showDetailedEvent}
      event={currentEvent}
      eventsHandlers={eventsHandlers} />
  );
}