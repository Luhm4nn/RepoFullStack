import cutzyLogoBlanco from '../../../assets/cutzy-logo-blanco.png';
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
  <nav className="bg-gradient-to-r from-purple-600 to-pink-600 py-2 px-5 border-b border-slate-800 sticky top-0 z-50">
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Only Cartelera button */}
        <div className={`w-full md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'} md:flex items-center md:justify-start`}>
          <ul className="flex flex-row p-2 md:p-0 mt-0 space-x-2 md:space-x-4 items-center md:justify-start w-full">
            <li className="flex items-center">
              <button
                onClick={() => handleNavigation('/')}
                className={`flex items-center gap-2 py-2 px-3 text-xl rounded md:p-0 transition-colors ${
                  isActive('/') 
                    ? '!text-white !bg-white/5 md:!bg-transparent' 
                    : 'text-gray-400 hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v3m10.5-3v3M2.25 9h19.5" />
                </svg>
                Cartelera
              </button>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => handleNavigation('/Peliculas')}
                className={`flex items-center gap-2 py-2 px-3 text-xl rounded md:p-0 transition-colors ${
                  isActive('/Peliculas') 
                    ? '!text-white bg-white/5 md:!bg-transparent' 
                    : 'text-gray-400 hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 17.25h15m-13.5 0V5.25A2.25 2.25 0 017.5 3h9a2.25 2.25 0 012.25 2.25v12" />
                </svg>
                Películas
              </button>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => handleNavigation('/Salas')}
                className={`flex items-center gap-2 py-2 px-3 text-xl rounded md:p-0 transition-colors ${
                  isActive('/Salas') 
                    ? '!text-white bg-white/5 md:!bg-transparent' 
                    : 'text-gray-400 hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75h15m-15 3h15m-15-6h15m-2.25-3v12m-10.5-12v12" />
                </svg>
                Salas
              </button>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => handleNavigation('/Funciones')}
                className={`flex items-center gap-2 py-2 px-3 text-xl rounded md:p-0 transition-colors ${
                  isActive('/Funciones') 
                    ? '!text-white bg-white/5 md:!bg-transparent' 
                    : 'text-gray-400 hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
                Funciones
              </button>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => handleNavigation('/Configuracion')}
                className={`flex items-center gap-2 py-2 px-3 text-xl rounded md:p-0 transition-colors ${
                  isActive('/Configuracion') 
                    ? '!text-white bg-white/5 md:!bg-transparent' 
                    : 'text-gray-400 hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
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