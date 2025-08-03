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
    <Navbar className="!bg-slate-900 p-5.5" >
      <NavbarBrand>
        <img src={logo} className="mr-3 h-12 sm:h-12 w-auto" />
      </NavbarBrand>
      <div className="flex md:order-2">
        <Dropdown
        className="!bg-slate-800 !text-white !border-slate-700"
          arrowIcon={false}
          inline
          label={
            <Avatar
              className="hover:!ring-2 hover:!ring-white transition-all duration-200 rounded-full w-full h-full p-0 m-0"
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <DropdownHeader>
            <span className="block text-sm !text-white">Bonnie Green</span>
            <span className="block truncate text-sm font-medium !text-white">name@flowbite.com</span>
          </DropdownHeader>
          <DropdownItem className="hover:!bg-white/5 !text-white">Dashboard</DropdownItem>
          <DropdownItem className="hover:!bg-white/5 !text-white">Settings</DropdownItem>
          <DropdownItem className="hover:!bg-white/5 !text-white">Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem className="hover:!bg-white/5 !text-white">Sign out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink className={`text-gray-400 text-xl hover:!text-white hover:bg-white/5 md:hover:!bg-transparent${useLocation().pathname === '/' ? ' !text-white !bg-white/5 md:!bg-transparent' : ''}`} href="/" active={useLocation().pathname === '/'}>
          Inicio
        </NavbarLink>
        <NavbarLink className={`text-gray-400 text-xl hover:!text-white hover:bg-white/5 md:hover:!bg-transparent${useLocation().pathname === '/Peliculas' ? ' !text-white bg-white/5 md:!bg-transparent' : ''}`} href="/Peliculas" active={useLocation().pathname === '/Peliculas'}>
          Peliculas
        </NavbarLink>
        <NavbarLink className={`text-gray-400 text-xl hover:!text-white hover:bg-white/5 md:hover:!bg-transparent${useLocation().pathname === '/Salas' ? ' !text-white bg-white/5 md:!bg-transparent' : ''}`} href="/Salas" active={useLocation().pathname === '/Salas'}>
          Salas
        </NavbarLink>
        <NavbarLink className={`text-gray-400 text-xl hover:!text-white hover:bg-white/5 md:hover:!bg-transparent${useLocation().pathname === '/Funciones' ? ' !text-white bg-white/5 md:!bg-transparent' : ''}`} href="/Funciones" active={useLocation().pathname === '/Funciones'}>
          Funciones
        </NavbarLink>
        <NavbarLink className={`text-gray-400 text-xl hover:!text-white hover:bg-white/5 md:hover:!bg-transparent${useLocation().pathname === '/Configuracion' ? ' !text-white bg-white/5 md:!bg-transparent' : ''}`} href="/Configuracion" active={useLocation().pathname === '/Configuracion'}>
          Configuracion
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
