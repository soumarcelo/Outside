import { EventCardProps } from "@/app/lib/definitions/props";
import { Card, CardBody, Stack } from "react-bootstrap";

export default function EventCardMobile(props : EventCardProps) {
  return (
    <Card className="bg-primary shadow-sm rounded-pill btn p-0" onClick={props.onClick}>
      <CardBody className="p-2 px-3">
        <Stack direction="horizontal" gap={3}>
          <span className="d-inline-block text-truncate fw-light text-white" style={{maxWidth: "150px"}}>{props.eventName}</span>
          <div className="vr"/>
          <span className="fw-bold text-white">{props.eventDay}/{props.eventMonth}</span>
        </Stack>
      </CardBody>
    </Card>
  );
}