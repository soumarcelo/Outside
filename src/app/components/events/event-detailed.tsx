import { EventTicketAllotmentData } from "@/app/lib/definitions/data";
import { DetailedEventProps, EventTicketAllotmentProps, SelectedTicketsProps, TicketAllotmentSummaryProps } from "@/app/lib/definitions/props";
import { Money } from "@/app/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { Button, CloseButton, Image, ListGroup, Modal, Stack } from "react-bootstrap";
import TicketAllotment from "../tickets-allotments/ticket-allotment";
import TicketsAllotmentsSummary from "../tickets-allotments/summary";

function CoverImage({ source }: { source?: string }) {
  return <Image className="h-100 w-100 object-fit-cover" src={source} fluid />;
}

function Head(props: DetailedEventProps) {
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicketsProps>({});
  const [totalTicketsValue, setTotalTicketsValue] = useState<number>(0);

  const incrementTicketsAllotments = useCallback((eta: EventTicketAllotmentData) => {
    setSelectedTickets((prevAllotments) => {
      const id = eta.id;
      const newAllotments = { ...prevAllotments };
      if (newAllotments[id]) {
        if (newAllotments[id].amount < eta.maxAmount) {
          newAllotments[id] = {
            ...newAllotments[id],
            amount: newAllotments[id].amount + 1,
            allotmentValue: eta.value * (newAllotments[id].amount + 1),
          };
        }
      } else {
        newAllotments[id] = {
          amount: 1,
          allotmentName: eta.name,
          allotmentValue: eta.value,
        };
      }
      return newAllotments;
    });
  }, []);

  const decrementTicketsAllotments = useCallback((eta: EventTicketAllotmentData) => {
    setSelectedTickets((prevAllotments) => {
      const id = eta.id;
      const newAllotments = { ...prevAllotments };
      if (newAllotments[id]) {
        if (newAllotments[id].amount > 1) {
          newAllotments[id] = {
            ...newAllotments[id],
            amount: newAllotments[id].amount - 1,
            allotmentValue: eta.value * (newAllotments[id].amount - 1),
          };
        } else {
          delete newAllotments[id];
        }
      }
      return newAllotments;
    });
  }, []);

  useEffect(() => {
    let total: number = 0;
    for (const tap of Object.values(selectedTickets)) {
      total += tap.allotmentValue;
    }
    setTotalTicketsValue(total);
  }, [selectedTickets]);

  return (
    <Stack gap={3}>
      <Stack id="event-detailed-info">
        <Modal.Title className="fs-1">{props.event?.name}</Modal.Title>
        <span className="fst-italic">By <a href="#">{props.event?.producer}</a></span>
      </Stack>
      <Stack id="event-detailed-duration">
        <span className="fs-6">Começa: <span className="fw-bold">{props.event?.startsAt.toFormat("dd/L - HH:mm")}</span></span>
        <span className="fs-6">Termina: <span className="fw-bold">{props.event?.finishesAt.toFormat("dd/L - HH:mm")}</span></span>
      </Stack>
      <Stack id="event-detailed-address" direction="horizontal" gap={2}>
        <Image src="/assets/icons/markers/location-80.png" width={16} height={16} />
        <span className="fw-light">{props.event?.address}</span>
      </Stack>
      <ListGroup id="event-detailed-tickets" className="mt-4">
        <ListGroup.Item><span className="fs-3">Tickets</span></ListGroup.Item>
        {props.event?.ticketsAllotments.map((ta) => (
          <ListGroup.Item key={ta.id}>
            <TicketAllotment
              ticketAllotment={ta}
              amount={selectedTickets[ta.id] ? selectedTickets[ta.id].amount : 0}
              onIncrementAmount={() => incrementTicketsAllotments(ta)}
              onDecrementAmount={() => decrementTicketsAllotments(ta)} />
          </ListGroup.Item>
        ))}
        {Object.keys(selectedTickets).length > 0 && <ListGroup.Item>
          <TicketsAllotmentsSummary selectedTickets={selectedTickets} totalTicketsValue={totalTicketsValue} />
        </ListGroup.Item>}
        <ListGroup.Item>
          <Button className="w-100" onClick={() => props.eventsHandlers.buyTickets(selectedTickets)}>Buy tickets</Button>
        </ListGroup.Item>
      </ListGroup>
    </Stack>
  );
}

function Body(props: DetailedEventProps) {
  return (
    <Stack id="event-detailed-description" gap={1} className="mt-4">
      <span className="fs-3">Description</span>
      <hr />
      <span>{props.event?.description}</span>
    </Stack>
  );
}

export default function DetailedEvent(props: DetailedEventProps) {
  return (
    <Modal id="event-detail" centered show={props.show} onShow={props.eventsHandlers.show} onHide={props.eventsHandlers.hide} size="lg">
      <CloseButton className="position-absolute top-0 end-0 m-3 btn-close-white" onClick={props.eventsHandlers.close} />
      <Stack>
        <CoverImage source={props.event?.image} />
        <Modal.Body className="py-2 px-4">
          <Head {...props} />
          <Body {...props} />
        </Modal.Body>
      </Stack>
    </Modal>
  );
}