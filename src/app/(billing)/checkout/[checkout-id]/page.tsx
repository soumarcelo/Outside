import TicketsAllotmentsSummary from "@/app/components/tickets-allotments/summary";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Image, Stack } from "react-bootstrap";

export default function Page({ params }) {
  const tickets = [
    {
      allotmentName: "Lote X",
      allotmentValue: 3000,
      amount: 3
    },
    {
      allotmentName: "Lote X",
      allotmentValue: 3000,
      amount: 3
    },
    {
      allotmentName: "Lote X",
      allotmentValue: 3000,
      amount: 3
    },
    {
      allotmentName: "Lote X",
      allotmentValue: 3000,
      amount: 3
    },
  ];

  // console.log(searchParams);

  // const [paymentMethod, setPaymentMethod] = useState({ name: "PIX", img: "https://dummyimage.com/35x35.png/000/fff&text=Logo" })

  return (
    <Stack className="my-5 w-75 mx-auto">
      <Accordion alwaysOpen defaultActiveKey={['0', '1']} className="h-100">
        <AccordionItem eventKey="0">
          <AccordionHeader className="">
            <Stack direction="horizontal" gap={2}>
              <Image width={64} height={64} src="https://dummyimage.com/64x64.png/000/fff&text=64x64" />
              <span className="fw-bold fs-5">Event Name</span>
            </Stack>
          </AccordionHeader>
          <AccordionBody>
            <TicketsAllotmentsSummary selectedTickets={tickets} totalTicketsValue={0} />
          </AccordionBody>
        </AccordionItem>
        <AccordionItem eventKey="1">
          <AccordionHeader>Pagamento</AccordionHeader>
          <AccordionBody>
            <Stack direction="horizontal">
              <Stack direction="horizontal" gap={2} className="w-100">
                {/* <Image height={35} width={35} src={paymentMethod.img} />
                <span className="fw-bold">{paymentMethod.name}</span> */}
              </Stack>
              <Button>Trocar</Button>
            </Stack>
          </AccordionBody>
        </AccordionItem>
      </Accordion>
      <Button className="my-4">Pagar</Button>
    </Stack>
  );
}