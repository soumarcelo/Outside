import { TicketAllotmentSummaryProps } from "@/app/lib/definitions/props";
import { Money } from "@/app/lib/utils";
import { Stack } from "react-bootstrap";

export default function TicketAllotmentSummaryItem({ amount, allotmentName, allotmentValue }: TicketAllotmentSummaryProps) {
  return (
    <Stack direction="horizontal">
      <span className="w-100">{amount} x </span>
      <span className="w-100 fw-bold text-center text-break">{allotmentName}</span>
      <span className="w-100 text-end">R$ {Money(allotmentValue)}</span>
    </Stack>
  );
}