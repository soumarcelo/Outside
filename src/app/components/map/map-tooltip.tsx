import { TooltipLocationEventsProps } from "@/app/lib/definitions/props";
import { ListGroup } from "react-bootstrap";
import { Tooltip as LTooltip } from "react-leaflet";
import EventItem from "../events/event-item";

export default function Tooltip({ eventsSummary, ...props }: TooltipLocationEventsProps) {
  return (
    <LTooltip {...props}>
      <ListGroup>
        <ListGroup.Item>
          <EventItem eventName={eventsSummary?.nextEventName} eventDay={eventsSummary?.nextEventDay} eventMonth={eventsSummary?.nextEventMonth} />
        </ListGroup.Item>
        {eventsSummary?.remainingEventsCount > 0 &&
          <ListGroup.Item className="d-flex justify-content-center">
            <span className="text-center fw-bolder">
              {"+ " + eventsSummary.remainingEventsCount.toString()}
            </span>
          </ListGroup.Item>}
      </ListGroup>
    </LTooltip>
  );
}