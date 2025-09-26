import { useState } from 'react';
import cutzyLogoBlanco from '../../../assets/cutzy-logo-blanco.png';
import './AdminNavbar.css';
import { Dropdown, Drawer, DrawerHeader, DrawerItems, Button as FlowbiteButton } from 'flowbite-react';
import { DropdownItem, DropdownDivider, DropdownHeader } from 'flowbite-react';
import { useNavigate, useLocation } from 'react-router-dom';
const AdminNavbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      navigate('/Cartelera');
    }
  };

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-700 py-4 px-5 border-b border-slate-800 sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto">
        <button
          onClick={() => handleNavigation('/')}
          className="flex items-center space-x-3 group ml-0 md:ml-4 mr-6 cursor-pointer"
        >
          <div className="h-16 w-32 bg-transparent rounded flex items-center justify-center group-hover:border-purple-600 transition-all">
            <img src={cutzyLogoBlanco} alt="Cutzy Logo" style={{ height: 56 }} />
          </div>
        </button>
        <div className="flex items-center md:order-2 ml-auto mr-0 md:mr-4 gap-2">
          <FlowbiteButton
            color="gray"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-white/5 transition-colors !bg-transparent !border-0"
            onClick={toggleMenu}
          >
            <span className="sr-only">Abrir menú</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </FlowbiteButton>
          <Dropdown
            label={
              <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.nombreUsuario?.charAt(0)}{user?.apellidoUsuario?.charAt(0)}
              </div>
            }
            inline
            placement="bottom-end"
            className="!bg-slate-800 !text-white !border-slate-700 rounded-lg shadow-xl min-w-[14rem]"
            arrowIcon={false}
          >
            <DropdownHeader className="px-4 py-3 border-b border-slate-700">
              <span className="block text-sm !text-white font-medium">
                {user?.nombreUsuario} {user?.apellidoUsuario}
              </span>
              <span className="block truncate text-sm !text-gray-300">
                {user?.email}
              </span>
              <span className="block text-xs !text-blue-400 font-medium mt-1">
                Administrador
              </span>
            </DropdownHeader>
            <DropdownItem className="!text-white hover:!bg-white/5">Dashboard</DropdownItem>
            <DropdownItem className="!text-white hover:!bg-white/5">Settings</DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout} className="!text-red-400 hover:!bg-red-500/10">Sign out</DropdownItem>
          </Dropdown>
          <Drawer open={isMenuOpen} onClose={toggleMenu} position="left" className="md:hidden">
            <DrawerHeader title="Menú" />
            <DrawerItems>
              <ul className="flex flex-col gap-2 mt-4">
                <li>
                  <button
                    onClick={() => { handleNavigation('/'); toggleMenu(); }}
                    className={`w-full text-left py-2 px-4 text-lg rounded transition-colors ${isActive('/') ? 'active !text-white !bg-white/5' : 'text-white hover:!text-white hover:bg-white/5'}`}
                  >
                    Cartelera
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleNavigation('/Peliculas'); toggleMenu(); }}
                    className={`w-full text-left py-2 px-4 text-lg rounded transition-colors ${isActive('/Peliculas') ? 'active !text-white !bg-white/5' : 'text-white hover:!text-white hover:bg-white/5'}`}
                  >
                    Películas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleNavigation('/Salas'); toggleMenu(); }}
                    className={`w-full text-left py-2 px-4 text-lg rounded transition-colors ${isActive('/Salas') ? 'active !text-white !bg-white/5' : 'text-white hover:!text-white hover:bg-white/5'}`}
                  >
                    Salas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleNavigation('/Funciones'); toggleMenu(); }}
                    className={`w-full text-left py-2 px-4 text-lg rounded transition-colors ${isActive('/Funciones') ? 'active !text-white !bg-white/5' : 'text-white hover:!text-white hover:bg-white/5'}`}
                  >
                    Funciones
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleNavigation('/Configuracion'); toggleMenu(); }}
                    className={`w-full text-left py-2 px-4 text-lg rounded transition-colors ${isActive('/Configuracion') ? 'active !text-white !bg-white/5' : 'text-white hover:!text-white hover:bg-white/5'}`}
                  >
                    Configuración
                  </button>
                </li>
              </ul>
            </DrawerItems>
          </Drawer>
        </div>
        <div className={`w-full md:w-auto md:order-1 hidden md:flex items-center md:justify-start`}>
          <ul className="flex flex-row p-2 md:p-0 mt-0 items-center md:justify-start w-full">
            <li className="flex items-center navbar-btn-space">
              <button
                onClick={() => handleNavigation('/Dashboard')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline cursor-pointer ${isActive('/Dashboard') ? 'active !text-white !bg-white/5 md:!bg-transparent' : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'}`}
              >
                Dashboard
              </button>
            </li>
            <li className="flex items-center navbar-btn-space">
              <button
                onClick={() => handleNavigation('/')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline cursor-pointer ${isActive('/') ? 'active !text-white !bg-white/5 md:!bg-transparent' : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'}`}
              >
                Cartelera
              </button>
            </li>
            <li className="flex items-center navbar-btn-space">
              <button
                onClick={() => handleNavigation('/Peliculas')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline cursor-pointer ${isActive('/Peliculas') ? 'active !text-white bg-white/5 md:!bg-transparent' : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'}`}
              >
                Películas
              </button>
            </li>
            <li className="flex items-center navbar-btn-space">
              <button
                onClick={() => handleNavigation('/Salas')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline cursor-pointer ${isActive('/Salas') ? 'active !text-white bg-white/5 md:!bg-transparent' : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'}`}
              >
                Salas
              </button>
            </li>
            <li className="flex items-center navbar-btn-space">
              <button
                onClick={() => handleNavigation('/Funciones')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline cursor-pointer ${isActive('/Funciones') ? 'active !text-white bg-white/5 md:!bg-transparent' : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'}`}
              >
                Funciones
              </button>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => handleNavigation('/Configuracion')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline cursor-pointer ${isActive('/Configuracion') ? 'active !text-white bg-white/5 md:!bg-transparent' : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'}`}
              >
                Configuración
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
