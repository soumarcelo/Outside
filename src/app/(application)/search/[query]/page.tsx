import EventsQueryResults from "@/app/components/events/events-query-results";
import { fetchEventsFromQuery } from "@/app/lib/data";
import { getBBoxFromQueryParams } from "@/app/lib/utils";

export default function Page({ params, searchParams }) {
  const query = decodeURIComponent(params.query);

  if (searchParams["bbox"] === undefined) return null;
  const bbox = getBBoxFromQueryParams(searchParams["bbox"]);
  const queryResults = fetchEventsFromQuery(query, bbox);
  return <EventsQueryResults query={query} queryResults={queryResults} />;
}