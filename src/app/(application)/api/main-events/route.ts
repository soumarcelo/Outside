import { fetchMainEventsAtBounds } from "@/app/lib/data";
import { getBBoxFromQueryParams } from "@/app/lib/utils";
import { URL } from "url";

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
    const url = new URL(request.url)
    const bbox = getBBoxFromQueryParams(url.searchParams.get("bbox"));
    const mainEvents = fetchMainEventsAtBounds(bbox);
    return Response.json(mainEvents)
}