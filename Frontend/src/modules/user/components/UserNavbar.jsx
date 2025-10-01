import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import cutzyLogoBlanco from '../../../assets/cutzy-logo-blanco.png';
import '../../admin/components/AdminNavbar.css';
import { Button as FlowbiteButton, Drawer, DrawerHeader, DrawerItems } from 'flowbite-react';

const UserNavbar = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      navigate('/Cartelera');
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-700 py-4 px-5 border-b border-slate-800 sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto">
        <button
          type="button"
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
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="hover:!ring-2 hover:!ring-white transition-all duration-200 rounded-full"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.nombreUsuario?.charAt(0) ?? ''}{user?.apellidoUsuario?.charAt(0) ?? ''}
              </div>
            </button>
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
                    Cliente
                  </span>
                </div>
                <ul className="py-2">
                  <li>
                    <button
                      type="button"
                      onClick={() => { handleNavigation('/mi-perfil'); setIsDropdownOpen(false); }}
                      className="block px-4 py-2 text-sm !text-white hover:!bg-white/5 w-full text-left"
                    >
                      Mi Perfil
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { handleNavigation('/mis-reservas'); setIsDropdownOpen(false); }}
                      className="block px-4 py-2 text-sm !text-white hover:!bg-white/5 w-full text-left"
                    >
                      Mis Reservas
                    </button>
                  </li>
                  <li className="border-t border-slate-700 mt-2 pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm !text-red-400 hover:!bg-red-500/10 w-full text-left"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <Drawer
            open={isMenuOpen}
            onClose={toggleMenu}
            position="left"
            className="md:hidden !bg-gray-900 !text-white"
          >
            <DrawerHeader title="Menú" className="!bg-gray-900 !text-white" />
            <DrawerItems className="!bg-gray-900 !text-white">
              <ul className="flex flex-col gap-2 mt-4">
                <li>
                  <button
                    onClick={() => handleNavigation('/')}
                    className={`w-full text-left py-2 px-4 text-lg rounded transition-colors ${isActive('/') ? 'active !text-white !bg-white/10' : 'text-white hover:!text-white hover:bg-white/10'} !bg-gray-900`}
                  >
                    Cartelera
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/mis-reservas')}
                    className={`w-full text-left py-2 px-4 text-lg rounded transition-colors ${isActive('/mis-reservas') ? 'active !text-white !bg-white/10' : 'text-white hover:!text-white hover:bg-white/10'} !bg-gray-900`}
                  >
                    Mis Reservas
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
                type="button"
                onClick={() => handleNavigation('/')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline cursor-pointer ${isActive('/') ? 'active !text-white !bg-white/5 md:!bg-transparent' : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'}`}
              >
                Cartelera
              </button>
            </li>
            <li className="flex items-center navbar-btn-space">
              <button
                type="button"
                onClick={() => handleNavigation('/mis-reservas')}
                className={`flex items-center gap-2 py-2 px-4 text-xl rounded md:p-0 transition-colors nav-underline cursor-pointer ${isActive('/mis-reservas') ? 'active !text-white bg-white/5 md:!bg-transparent' : 'text-white hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'}`}
              >
                Mis Reservas
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;