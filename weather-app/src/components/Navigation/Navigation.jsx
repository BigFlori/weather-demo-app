import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import classes from "./Navigation.module.css";

const Navigation = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='md'>
      <Container className="">
        <Navbar.Brand href='#'>Időjárás</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav' className="justify-content-end">
          <Nav>
            <Nav.Link href='https://github.com/BigFlori' target="_blank">Github</Nav.Link>
            <Nav.Link href='https://www.linkedin.com/in/florian-molnar-2323b1252/' target="_blank">LinkedIn</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
