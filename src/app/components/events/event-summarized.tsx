'use client'

import { SummarizedEventProps } from "@/app/lib/definitions/props";
import { DateTime } from "luxon";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Image, Stack, Offcanvas as BSOffcanvas } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

export default function SummarizedEvent({ event, locationPosition } : SummarizedEventProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' });

  const [showSummarizedEvent, setShowSummarizedEvent] = useState<boolean>(true);

  const eventStartsAt = DateTime.fromISO(event.startsAt);

  const eventsHandlers = {
      show: () => {},
      hide: () => {
        setShowSummarizedEvent(false);
        router.back();
      },
      showDetails: () => router.push(pathname + "/details"),
      showAddress: () => router.replace(`${pathname}?flyto=${locationPosition}`),
    };

  return (
    <BSOffcanvas backdrop={false} show={showSummarizedEvent} onShow={eventsHandlers.show} onHide={eventsHandlers.hide}>
      <BSOffcanvas.Header closeButton closeVariant="white" className="position-absolute top-0 end-0" />
      <Stack className="overflow-auto">
        <Image width={"100%"} src={event.image} fluid />
        <Stack gap={2} className="my-2 mx-3">
          <Stack direction="horizontal">
            <BSOffcanvas.Title className="fs-3">{event.name}</BSOffcanvas.Title>
            <span className="fs-1 fw-bold">{eventStartsAt.day}/{eventStartsAt.month}</span>
          </Stack>
          <span className="fst-italic">By {event.producer}</span>
          <Stack direction="horizontal" gap={2}>
            <Image src="/assets/icons/markers/location-80.png" width={16} height={16} />
            <a className="fw-light link-underline link-underline-opacity-0" onClick={eventsHandlers.showAddress}>{event.address}</a>
          </Stack>
          <span>{event.description}</span>
          {(isTabletOrMobile && !isPortrait) && <Button className="mx-5 my-3" onClick={eventsHandlers.showDetails}>Details</Button>}
        </Stack>
      </Stack>
      {(isDesktopOrLaptop || (isTabletOrMobile && isPortrait)) && <Button className="mx-5 my-3" onClick={eventsHandlers.showDetails}>Details</Button>}
    </BSOffcanvas>
  );
}