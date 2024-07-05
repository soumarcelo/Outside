import { Container, Navbar, NavbarBrand } from "react-bootstrap";

export default function NavBar(props) {
  return (
    <Navbar {...props}>
      <Container>
        <NavbarBrand href="/">Outside</NavbarBrand>
      </Container>
    </Navbar>    
  );
}