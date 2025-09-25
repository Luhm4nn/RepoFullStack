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
    <nav className="!bg-slate-900 p-5.5 border-b border-slate-800">
      <div className="flex flex-wrap items-center justify-between mx-auto">
        {/* Logo */}
  <button onClick={() => handleNavigation('/')} className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V9a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
        </button>

        {/* User dropdown */}
        <div className="flex items-center md:order-2">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="hover:!ring-2 hover:!ring-white transition-all duration-200 rounded-full"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
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
                Cartelera
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;