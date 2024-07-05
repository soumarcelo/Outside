'use client'

import { MapContext } from "@/app/(map)/layout";
import SummarizedEvent from "@/app/components/events/event-summarized";
import { fetchEventData, fetchLocationFromId } from "@/app/lib/data";
import { EventData } from "@/app/lib/definitions/data";
import { MapContextProviderProps } from "@/app/lib/definitions/props";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Page({params}) {
  const eventId = params["event-id"];

  const router = useRouter();
  const pathname = usePathname();
  const { mapFlyTo, mapMaxZoom } = useContext<MapContextProviderProps>(MapContext);
  const [showSummarizedEvent, setShowSummarizedEvent] = useState<boolean>(true);
  const [currentEvent, setCurrentEvent] = useState<EventData | undefined>(undefined);

  useEffect(() => {
    const event = fetchEventData(eventId, true);
    setCurrentEvent(event);
  }, []);

  const eventsHandlers = {
    show: () => {},
    hide: () => {
      setShowSummarizedEvent(false);
      router.back();
    },
    showDetails: () => {router.push(pathname + "/details")},
    showAddress: () => {
      const location = fetchLocationFromId(params["location-id"]);
      if (location === undefined) return;
      if (mapFlyTo == undefined) return;
      mapFlyTo(location.position, mapMaxZoom);
    },
  };

  return (
    <SummarizedEvent
      id="event-summary"
      show={showSummarizedEvent}
      event={currentEvent}
      eventsHandlers={eventsHandlers}
    />
  );
}