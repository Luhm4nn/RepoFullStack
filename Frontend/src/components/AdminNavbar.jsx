import { useLocation } from "react-router-dom";
import logo from '../assets/cutzy-logo-blanco.png';
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

export default function AdminNavbar() {
  return (
    <Navbar className="!bg-slate-900" >
      <NavbarBrand >
        <img src={logo} className="mr-3 h-6 sm:h-9"  />
      </NavbarBrand>
      <div className="flex md:order-2">
        <Dropdown
        className="!bg-slate-800/80 !text-white !border-slate-700"
          arrowIcon={false}
          inline
          label={
            <Avatar className="hover:!ring-2 hover:!ring-white transition-all duration-200 rounded-full" alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <DropdownHeader>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
          </DropdownHeader>
          <DropdownItem className="hover:!bg-white/5">Dashboard</DropdownItem>
          <DropdownItem className="hover:!bg-white/5">Settings</DropdownItem>
          <DropdownItem className="hover:!bg-white/5">Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem className="hover:!bg-white/5">Sign out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="/" active={useLocation().pathname === '/'}>
          Inicio
        </NavbarLink>
        <NavbarLink href="/Peliculas" active={useLocation().pathname === '/Peliculas'}>
          Peliculas
        </NavbarLink>
        <NavbarLink href="/Salas" active={useLocation().pathname === '/Salas'}>
          Salas
        </NavbarLink>
        <NavbarLink href="/Funciones" active={useLocation().pathname === '/Funciones'}>
          Funciones
        </NavbarLink>
        <NavbarLink href="/Configuracion" active={useLocation().pathname === '/Configuracion'}>
          Configuracion
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
