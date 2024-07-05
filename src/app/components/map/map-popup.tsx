import { PopupLocationEventProps } from "@/app/lib/definitions/props";
import { Button, ListGroup } from "react-bootstrap";
import { Popup as LPopup } from "react-leaflet";
import EventItem from "../events/event-item";

export default function Popup({ events, onSelectEvent, ...props }: PopupLocationEventProps) {
  return (
    <LPopup {...props}>
      <ListGroup>
        {events.map((ev) => (
          <ListGroup.Item key={ev.id} action onClick={onSelectEvent ? () => onSelectEvent(ev) : undefined}>
            <EventItem eventName={ev.name} eventDay={ev.startsAt.day} eventMonth={ev.startsAt.month} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </LPopup>
  );
}