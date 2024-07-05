import { EventItemProps } from "@/app/lib/definitions/props";
import { Stack } from "react-bootstrap";

export default function EventItem(props : EventItemProps) {
  return (
    <Stack direction="horizontal" gap={2}>
      <span className="text-start text-truncate" style={{ maxWidth: "150px" }}>{props.eventName}</span>
      <div className="vr" />
      <span className="fw-bold">{props.eventDay + "/" + props.eventMonth}</span>
    </Stack>
  );
}