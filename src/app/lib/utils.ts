import { v4 } from "uuid";
import { EventCardProps } from "./definitions";
import { LocationEventData } from "./definitions/data";
import { DateTime } from "luxon";

const options = { minimumFractionDigits: 2 }
export const Money = (value: number) => new Intl.NumberFormat('pt-BR', options).format(value / 100);

export function generateEventCardProps(
  event: LocationEventData,
  onClickAction: () => void
) {
  const eventStartsAt = DateTime.fromISO(event.startsAt);

  const props: EventCardProps = {
    cardId: v4(),
    eventImageURL: "https://dummyimage.com/250x125.png/000/fff&text=CardSmallHeader",
    onClick: onClickAction,
    eventName: event.name,
    eventDay: eventStartsAt.day ?? 0,
    eventMonth: eventStartsAt.month
  }
  return props;
}

export function getBBoxFromQueryParams(bboxString: string) {
  const bbox = bboxString.split(",").map((coord) => Number(coord));
  // [southwest lat, southwest lng, northest lat, northest lng]
  return [bbox[1], bbox[0], bbox[3], bbox[2]]; 
}