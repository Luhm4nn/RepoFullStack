import cutzyLogoBlanco from '../../../assets/cutzy-logo-blanco.png';
import './AdminNavbar.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const AdminNavbar = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
  <nav className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-700 py-4 px-5 border-b border-slate-800 sticky top-0 z-50">
  <div className="flex items-center justify-between mx-auto">
        {/* Logo */}
  <button onClick={() => handleNavigation('/')} className="flex items-center space-x-3 group ml-0 md:ml-4 mr-6 cursor-pointer">
          <div className="h-16 w-32 bg-transparent rounded flex items-center justify-center group-hover:border-purple-600 transition-all">
            <img src={cutzyLogoBlanco} alt="Cutzy Logo" style={{ height: 56 }} />
          </div>
        </button>

        {/* User dropdown */}
  <div className="flex items-center md:order-2 ml-auto mr-0 md:mr-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="hover:!ring-2 hover:!ring-white transition-all duration-200 rounded-full"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.nombreUsuario?.charAt(0)}{user?.apellidoUsuario?.charAt(0)}
              </div>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 w-56 !bg-slate-800 !text-white !border-slate-700 rounded-lg shadow-xl">
                <div className="px-4 py-3 border-b border-slate-700">
                  <span className="block text-sm !text-white font-medium">
                    {user?.nombreUsuario} {user?.apellidoUsuario}
                  </span>
                  <span className="block truncate text-sm !text-gray-300">
                    {user?.email}
                  </span>
                  <span className="block text-xs !text-blue-400 font-medium mt-1">
                    Administrador
                  </span>
                </div>
                <ul className="py-2">
                  <li>
                    <button className="block px-4 py-2 text-sm !text-white hover:!bg-white/5 w-full text-left">
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button className="block px-4 py-2 text-sm !text-white hover:!bg-white/5 w-full text-left">
                      Settings
                    </button>
                  </li>
                  <li className="border-t border-slate-700 mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm !text-red-400 hover:!bg-red-500/10 w-full text-left"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button 
            onClick={toggleMenu}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-white/5 transition-colors ml-3"
          >
            {/* Icono de menú removido */}
          </button>
        </div>

        {/* Only Cartelera button */}
        <div className={`w-full md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'} md:flex items-center md:justify-start`}>
          <ul className="flex flex-row p-2 md:p-0 mt-0 items-center md:justify-start w-full">
            <li className="flex items-center navbar-btn-space">
              <button
                onClick={() => handleNavigation('/')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline ${
                  isActive('/') 
                    ? 'active !text-white !bg-white/5 md:!bg-transparent' 
                    : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                {/* Icono removido */}
                Cartelera
              </button>
            </li>
            <li className="flex items-center navbar-btn-space">
              <button
                onClick={() => handleNavigation('/Peliculas')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline ${
                  isActive('/Peliculas') 
                    ? 'active !text-white bg-white/5 md:!bg-transparent' 
                    : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                {/* Icono removido */}
                Películas
              </button>
            </li>
            <li className="flex items-center navbar-btn-space">
              <button
                onClick={() => handleNavigation('/Salas')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline ${
                  isActive('/Salas') 
                    ? 'active !text-white bg-white/5 md:!bg-transparent' 
                    : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                {/* Icono removido */}
                Salas
              </button>
            </li>
            <li className="flex items-center navbar-btn-space">
              <button
                onClick={() => handleNavigation('/Funciones')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline ${
                  isActive('/Funciones') 
                    ? 'active !text-white bg-white/5 md:!bg-transparent' 
                    : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                {/* Icono removido */}
                Funciones
              </button>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => handleNavigation('/Configuracion')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline ${
                  isActive('/Configuracion') 
                    ? 'active !text-white bg-white/5 md:!bg-transparent' 
                    : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                {/* Icono removido */}
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