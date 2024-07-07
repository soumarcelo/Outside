import EventsFromLocation from "@/app/components/events/events-from-location";
import { fetchEventsFromLocation } from "@/app/lib/data";
import { LocationEventData } from "@/app/lib/definitions/data";

export default function Page({ params }) {
  const locationId = params["location-id"];
  const locationEvents: LocationEventData[] = fetchEventsFromLocation(locationId);
  return <EventsFromLocation locationEvents={locationEvents} />;
}