import DetailedEvent from "@/app/components/events/event-detailed";
import { fetchDetailedEventData, fetchEventData } from "@/app/lib/data";
import { DetailedEventData } from "@/app/lib/definitions/data";
import { SelectedTicketsProps } from "@/app/lib/definitions/props";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export default function Page({ params }) {
  const eventId = params["event-id"];
  const event = fetchDetailedEventData(eventId);
  return <DetailedEvent event={event} />;
}