import { Stack } from "react-bootstrap";
import NavBar from "../components/navbars/navbar";

export default function BillingLayout({ children }) {
  return (
    <Stack className="vh-100">
      <NavBar/>
      {children}
    </Stack>
  );
}