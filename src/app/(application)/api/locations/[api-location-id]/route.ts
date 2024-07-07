import { fetchLocationFromId } from "@/app/lib/data";
import { URL } from "url";

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
    const url = new URL(request.url)
    const splittedPathname = url.pathname.split("/");
    const id = splittedPathname[splittedPathname.length - 1];
    const location = fetchLocationFromId(id);
    if (location === undefined) 
        return Response.json({}, {status: 404, statusText: "location not found"});
    return Response.json(location ?? {});
}