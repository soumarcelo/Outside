import { fetchLocationsAtBounds, fetchLocationsFromQuery } from "@/app/lib/data";
import { LocationData } from "@/app/lib/definitions";
import { getBBoxFromQueryParams } from "@/app/lib/utils";
import { URL } from "url";

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
    const url = new URL(request.url)
    const bbox = getBBoxFromQueryParams(url.searchParams.get("bbox"));
    const query = url.searchParams.get("q");
    let locations : LocationData[] = [];
    if (query !== null) {
        locations = fetchLocationsFromQuery(query, bbox)
    }
    else locations = fetchLocationsAtBounds(bbox);
    return Response.json(locations)
}