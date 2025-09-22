import { useState } from 'react';
import cutzyLogo from '../../assets/cutzy-logo-blanco.png'; 

const PublicNavbar = ({ user, isAuthenticated, onLogin, onLogout, currentPath, onNavigate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    if (onNavigate) onNavigate(path);
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    if (onLogin) onLogin();
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

  const isActive = (path) => currentPath === path;

  return (
    <nav className="!bg-slate-900 p-5.5 border-b border-slate-800">
      <div className="flex flex-wrap items-center justify-between mx-auto">
        {/* Logo */}
        <button
          onClick={() => handleNavigation('/')}
          className="flex items-center space-x-3 group"
        >
          <div className="h-14 w-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded flex items-center justify-center border-2 border-slate-800  group-hover:border-white transition-all">
            <img src={cutzyLogo} alt="Cutzy Logo" style={{ height: 40 }} />
          </div>
        </button>

        {/* User Menu o Login Button */}
        <div className="flex items-center md:order-2">
          {isAuthenticated && user ? (
            // Usuario logueado (cliente) - Dropdown
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:!ring-2 hover:!ring-white transition-all duration-200 rounded-full"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
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
                    <span className="block text-xs !text-green-400 font-medium mt-1">
                      Cliente
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <button className="block px-4 py-2 text-sm !text-white hover:!bg-white/5 w-full text-left">
                        Mi Perfil
                      </button>
                    </li>
                    <li>
                      <button className="block px-4 py-2 text-sm !text-white hover:!bg-white/5 w-full text-left">
                        Mis Reservas
                      </button>
                    </li>
                    <li className="border-t border-slate-700 mt-2 pt-2">
                      <button 
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
          ) : (
            // Usuario no logueado - Login button
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-300/50 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Iniciar Sesión
            </button>
          )}

          {/* Mobile menu button */}
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

        {/* Navigation Links */}
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col p-4 md:p-0 mt-4 md:space-x-8 md:flex-row md:mt-0 md:border-0">
            <li>
              <button
                onClick={() => handleNavigation('/')}
                className={`block py-2 px-3 text-xl rounded md:p-0 transition-colors ${
                  isActive('/') 
                    ? '!text-white !bg-white/5 md:!bg-transparent' 
                    : 'text-gray-400 hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                Inicio
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/cartelera')}
                className={`block py-2 px-3 text-xl rounded md:p-0 transition-colors ${
                  isActive('/cartelera') 
                    ? '!text-white bg-white/5 md:!bg-transparent' 
                    : 'text-gray-400 hover:!text-white hover:bg-white/5 md:hover:!bg-transparent'
                }`}
              >
                Cartelera
              </button>
            </li>
            
            {/* Links adicionales para usuario logueado */}
            {isAuthenticated && user && (
              <li>
                <button
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