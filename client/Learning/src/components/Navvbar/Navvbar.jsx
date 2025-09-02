import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

function Navvbar() {
  const location = useLocation();
  return (
    <Navbar fluid rounded>
      <NavbarBrand as={Link} to="/">
        <img
          src="../public/Marvel_Logo.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Farmer Schemes
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Button>Get started</Button>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink as={Link} to="/" active={location.pathname == "/"}>
          Home
        </NavbarLink>
        <NavbarLink
          as={Link}
          to="/schemes"
          active={location.pathname == "/schemes"}
        >
          Schemes
        </NavbarLink>
        <NavbarLink as={Link} to="/maps" active={location.pathname == "/maps"}>
          Maps
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Navvbar;
