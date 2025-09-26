
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import cutzyLogoBlanco from '../../../assets/cutzy-logo-blanco.png';


const PublicNavbar = ({ user, isAuthenticated, onLogin, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      navigate('/');
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const isActive = (path) => location.pathname === path;

  return (
  <nav className="bg-gradient-to-r from-purple-600 to-pink-600 py-2 px-5 border-b border-slate-800 sticky top-0 z-50">
  <div className="flex flex-wrap items-center justify-between mx-auto">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavigation('/')}
          className="flex items-center space-x-3 group ml-0 md:ml-4 mr-6 cursor-pointer"
        >
          <div className="h-16 w-32 bg-transparent rounded flex items-center justify-center">
            <img src={cutzyLogoBlanco} alt="Cutzy Logo" style={{ height: 56 }} />
          </div>
        </button>

        {/* User Menu o Login Button */}
  <div className="flex items-center md:order-2 ml-auto mr-0 md:mr-4">
          <div className={`w-full md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'} md:flex items-center md:justify-start`}>
            <ul className="flex flex-row p-2 md:p-0 mt-0 space-x-2 md:space-x-4 items-center md:justify-start w-full">
              {isAuthenticated && user ? (
                // Usuario logueado (cliente) - Dropdown
                <li className="relative">
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="hover:!ring-2 hover:!ring-white transition-all duration-200 rounded-full"
                  >
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.nombreUsuario?.charAt(0) ?? ''}{user?.apellidoUsuario?.charAt(0) ?? ''}
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
                    <span className="block text-xs !text-green-400 font-medium mt-1">
                      Cliente
                    </span>
                  </div>
                  <ul className="py-2">
                      <button type="button" className="block px-4 py-2 text-sm !text-white hover:!bg-white/5 w-full text-left">
                        Mi Perfil
                      </button>
                    <li>
                      <button type="button" className="block px-4 py-2 text-sm !text-white hover:!bg-white/5 w-full text-left">
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
                </li>
              ) : (
                // Usuario no logueado - Login button
                <li>
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-300/50 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Iniciar Sesión
                  </button>
                </li>
              )}
            </ul>
          </div>
          {/* Mobile menu button */}
          <button 
            type="button"
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

        {/* Navigation Links */}
        <div className={`items-center w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col p-4 md:p-0 mt-4 md:space-x-8 md:flex-row md:mt-0 md:border-0 items-start justify-start">
            <li className="flex items-center">
              <button
                type="button"
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
            
            {/* Links adicionales para usuario logueado */}
            {isAuthenticated && user && (
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigation('/mis-reservas')}
                  className={`block py-2 px-3 text-xl rounded md:p-0 transition-colors ${
                    isActive('/mis-reservas') 
                      ? '!text-white bg-white/5 md:!bg-transparent' 
                      : 'text-gray-400 hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                  }`}
                >
                  Mis Reservas
                </button>
              </li>
            )}

            {/* Login link para mobile cuando no está autenticado */}
            {!isAuthenticated && (
              <li className="md:hidden">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="block py-2 px-3 text-xl rounded transition-colors text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  Iniciar Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;