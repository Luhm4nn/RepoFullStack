import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import cutzyLogoBlanco from '../../../assets/cutzy-logo-blanco.png';
import '../../admin/components/AdminNavbar.css';
import { Button as FlowbiteButton, Drawer, DrawerHeader, DrawerItems } from 'flowbite-react';

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

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
          <button
            type="button"
            onClick={handleLogin}
            className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all cursor-pointer"
          >
            Iniciar Sesión
          </button>
          {/* Drawer para menú mobile */}
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
                    onClick={handleLogin}
                    className="w-full text-left py-2 px-4 text-lg rounded transition-colors text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 !bg-gray-900"
                  >
                    Iniciar Sesión
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;