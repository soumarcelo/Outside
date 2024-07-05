import { EventTicketAllotmentProps } from "@/app/lib/definitions/props";
import { Money } from "@/app/lib/utils";
import { Button, Stack } from "react-bootstrap";

export default function TicketAllotment(props: EventTicketAllotmentProps) {
  return (
    <Stack direction="horizontal" gap={2} className="bg-secondary p-3 rounded">
      <Stack gap={3}>
        <span className="fw-bold fs-5">{props.ticketAllotment.name}</span>
        <span className="fst-italic">R$ {Money(props.ticketAllotment.value)}</span>
      </Stack>
      <Stack direction="horizontal" gap={2}>
        <Button className="rounded-circle" disabled={props.amount == 0} onClick={props.onDecrementAmount}>{"<"}</Button>
        <span className="fw-bold">{props.amount}</span>
        <Button className="rounded-circle" disabled={props.amount == props.ticketAllotment.maxAmount} onClick={props.onIncrementAmount}>{">"}</Button>
      </Stack>
    </Stack>
  );
}