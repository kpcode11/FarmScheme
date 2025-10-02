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
        <select
          className="select select-bordered select-sm mr-2"
          onChange={(e) => {
            const lang = e.target.value;
            if (window.setLanguage) window.setLanguage(lang);
          }}
          defaultValue="en"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="bn">বাংলা</option>
          <option value="te">తెలుగు</option>
          <option value="mr">मराठी</option>
          <option value="ta">தமிழ்</option>
          <option value="ur">اردو</option>
          <option value="gu">ગુજરાતી</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="ml">മലയാളം</option>
          <option value="pa">ਪੰਜਾਬੀ</option>
          <option value="or">ଓଡ଼ିଆ</option>
          <option value="as">অসমীয়া</option>
        </select>
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
