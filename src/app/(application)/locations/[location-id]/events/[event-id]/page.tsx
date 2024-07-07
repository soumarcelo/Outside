import SummarizedEvent from "@/app/components/events/event-summarized";
import { fetchEventData, fetchLocationFromId } from "@/app/lib/data";

export default function Page({ params }) {
  const event = fetchEventData(params["event-id"]);
  const location = fetchLocationFromId(params["location-id"]);
  return <SummarizedEvent
    locationPosition={`${location?.position[0]},${location?.position[1]}`}
    event={event}
  />;
}