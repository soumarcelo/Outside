'use client'

import { EventTicketAllotmentData } from "@/app/lib/definitions/data";
import { DetailedEventProps, SelectedTicketsProps } from "@/app/lib/definitions/props";
import { useCallback, useEffect, useState } from "react";
import { Button, CloseButton, Image, ListGroup, Modal, Stack } from "react-bootstrap";
import TicketAllotment from "../tickets-allotments/ticket-allotment";
import TicketsAllotmentsSummary from "../tickets-allotments/summary";
import { v4 } from "uuid";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";

function CoverImage({ source }: { source?: string }) {
  return <Image className="h-100 w-100 object-fit-cover" src={source} fluid />;
}

function Head({ event, eventsHandlers }) {
  const eventStartAt = DateTime.fromISO(event.startsAt);
  const eventFinishesAt = DateTime.fromISO(event.finishesAt);

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
        <Modal.Title className="fs-1">{event.name}</Modal.Title>
        <span className="fst-italic">By <a href="#">{event.producer}</a></span>
      </Stack>
      <Stack id="event-detailed-duration">
        <span className="fs-6">Começa: <span className="fw-bold">{eventStartAt.toFormat("dd/L - HH:mm")}</span></span>
        <span className="fs-6">Termina: <span className="fw-bold">{eventFinishesAt.toFormat("dd/L - HH:mm")}</span></span>
      </Stack>
      <Stack id="event-detailed-address" direction="horizontal" gap={2}>
        <Image src="/assets/icons/markers/location-80.png" width={16} height={16} />
        <span className="fw-light">{event.address}</span>
      </Stack>
      <ListGroup id="event-detailed-tickets" className="mt-4">
        <ListGroup.Item><span className="fs-3">Tickets</span></ListGroup.Item>
        {event.ticketsAllotments.map((ta) => (
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
          <Button className="w-100" onClick={() => eventsHandlers.buyTickets(selectedTickets)}>Buy tickets</Button>
        </ListGroup.Item>
      </ListGroup>
    </Stack>
  );
}

function Body({event}) {
  return (
    <Stack id="event-detailed-description" gap={1} className="mt-4">
      <span className="fs-3">Description</span>
      <hr />
      <span>{event.description}</span>
    </Stack>
  );
}

export default function DetailedEvent({ event, ...props }: DetailedEventProps) {
  const router = useRouter();
  const [showDetailedEvent, setShowDetailedEvent] = useState<boolean>(true);

  const eventsHandlers = {
    show: () => { },
    hide: () => {
      setShowDetailedEvent(false);
      router.back();
    },
    close: () => {
      setShowDetailedEvent(false);
      router.back();
    },
    buyTickets: (selectedTickets: SelectedTicketsProps) => {
      if (event === undefined) return;
      console.log(event.id);
      console.log(selectedTickets);
      const checkoutId = v4();
      router.push("/checkout/" + checkoutId);
    },
  };

  return (
    <Modal id="event-detail" centered show={showDetailedEvent} onShow={eventsHandlers.show} onHide={eventsHandlers.hide} size="lg">
      <CloseButton className="position-absolute top-0 end-0 m-3 btn-close-white" onClick={eventsHandlers.close} />
      <Stack>
        <CoverImage source={event?.image} />
        <Modal.Body className="py-2 px-4">
          <Head event={event} eventsHandlers={eventsHandlers} />
          <Body event={event} />
        </Modal.Body>
      </Stack>
    </Modal>
  );
}