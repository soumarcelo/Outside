import { Stack } from "react-bootstrap";
import TicketAllotmentSummaryItem from "./summary-item";
import { Money } from "@/app/lib/utils";

export default function TicketsAllotmentsSummary({ selectedTickets, totalTicketsValue }) {
  return (
    <Stack gap={2}>
      <span className="fs-5 fw-light">Summary</span>
      <Stack>
        {Object.entries(selectedTickets).map(
          ([key, tap]) => (
            <TicketAllotmentSummaryItem key={key}
              amount={tap.amount}
              allotmentName={tap.allotmentName}
              allotmentValue={tap.allotmentValue} />
          )
        )}
      </Stack>
      <Stack>
        <hr />
        <Stack direction="horizontal">
          <span className="fw-bold w-100">Total</span>
          <span className="w-100 text-end">R$ {Money(totalTicketsValue)}</span>
        </Stack>
      </Stack>
    </Stack>
  );
}