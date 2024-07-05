// import { useMediaQuery } from "react-responsive";

import { v4 } from "uuid";
import { EventCardProps } from "./definitions";
import { LocationEventData } from "./definitions/data";

// export const IsPortrait = () => useMediaQuery({ query: '(orientation: portrait)' });
// export const IsTabletOrMobile = () => useMediaQuery({ query: '(max-width: 1224px)' });
// export const IsDesktopOrLaptop = () => useMediaQuery({ query: '(min-width: 1224px)' });

const options = { minimumFractionDigits: 2 }
export const Money = (value: number) => new Intl.NumberFormat('pt-BR', options).format(value / 100);

export function generateEventCardProps(
    event: LocationEventData,
    onClickAction: () => void
  ) {
    const props: EventCardProps = {
      cardId: v4(),
      eventImageURL: "https://dummyimage.com/250x125.png/000/fff&text=CardSmallHeader",
      onClick: onClickAction,
      eventName: event.name,
      eventDay: event.startsAt.day ?? 0,
      eventMonth: event.startsAt.month
    }
    return props;
  }