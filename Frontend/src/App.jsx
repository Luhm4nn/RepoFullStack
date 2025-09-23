import { useState, useEffect } from 'react';
import AdminNavbar from './components/Shared/AdminNavbar';
import PublicNavbar from './components/Shared/PublicNavbar';
import MainPage from './pages/MainPage';
import NotFound from './pages/NotFound';
import PeliculasPage from './pages/PeliculasPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import FuncionesPage from './pages/FuncionesPage';
import SalasPage from './pages/SalasPage';
import FooterComp from './components/Shared/FooterComp';
import Terminos from './pages/FooterPages/Terminos';
import Privacity from './pages/FooterPages/Privacity';
import AboutMe from './pages/FooterPages/AboutMe';
import FAQ from './pages/FooterPages/FAQ';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { authAPI } from './api/login.api';
import { usuariosAPI } from './api/usuarios.api';

function App() {
  // Estados de autenticación
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Estado de navegación
  const [currentPath, setCurrentPath] = useState('/');

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authData = authAPI.checkAuth();
      if (authData) {
        setUser(authData.user);
        setToken(authData.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // Función de login
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const { token: newToken, user: userData } = await authAPI.login(email, password);
      
      setUser(userData);
      setToken(newToken);
      setIsAuthenticated(true);
      
      // Redirigir según rol
      if (userData.rol === 'ADMIN') {
        setCurrentPath('/Peliculas');
      } else {
        setCurrentPath('/');
      }
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.message || 'Error en el login' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const handleRegister = async (userData) => {
    try {
      await usuariosAPI.register(userData);
      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: error.message || 'Error en el registro' 
      };
    }
  };

  // Función de logout
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setCurrentPath('/');
    }
  };

  // Navegación
  const handleNavigation = (path) => {
    setCurrentPath(path);
  };

  const handleLoginNavigation = () => {
    setCurrentPath('/login');
  };

  // Verificar si el usuario tiene acceso a una ruta
  const hasAccess = (requiredRole = null) => {
    if (!requiredRole) return true; // Ruta pública
    if (!isAuthenticated) return false;
    if (requiredRole === 'ADMIN' && user?.rol !== 'ADMIN') return false;
    return true;
  };

  // Componente de ruta protegida
  const ProtectedRoute = ({ children, requiredRole = null }) => {
    if (!hasAccess(requiredRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h2>
            <p className="text-gray-400 mb-6">
              {!isAuthenticated 
                ? 'Debes iniciar sesión para acceder a esta página' 
                : 'No tienes permisos para acceder a esta página'
              }
            </p>
            <button
              onClick={() => !isAuthenticated ? handleLoginNavigation() : handleNavigation('/')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
            >
              {!isAuthenticated ? 'Iniciar Sesión' : 'Volver al Inicio'}
            </button>
          </div>
        </div>
      );
    }
    return children;
  };

  // Renderizar contenido según la ruta actual
  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <MainPage />;
      
      case '/login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToRegister={() => handleNavigation('/register')}
            onNavigateHome={() => handleNavigation('/')}
            user={user}
            isAuthenticated={isAuthenticated}
            loading={loading}
          />
        );
      
      case '/register':
        return (
          <RegisterPage
            onRegister={handleRegister}
            onNavigateToLogin={() => handleNavigation('/login')}
            onNavigateHome={() => handleNavigation('/')}
            loading={loading}
          />
        );
      
      case '/Peliculas':
        return (
          <ProtectedRoute requiredRole="ADMIN">
            <PeliculasPage />
          </ProtectedRoute>
        );
      
      case '/Salas':
        return (
          <ProtectedRoute requiredRole="ADMIN">
            <SalasPage />
          </ProtectedRoute>
        );
      
      case '/Funciones':
        return (
          <ProtectedRoute requiredRole="ADMIN">
            <FuncionesPage />
          </ProtectedRoute>
        );
      
      case '/Configuracion':
        return (
          <ProtectedRoute requiredRole="ADMIN">
            <ConfiguracionPage />
          </ProtectedRoute>
        );
      
      case '/Terminos':
        return <Terminos />;
      
      case '/Privacity':
        return <Privacity />;
      
      case '/AboutMe':
        return <AboutMe />;
      
      case '/FAQ':
        return <FAQ />;
      
      default:
        return <NotFound />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-montserrat">
      {/* Navbar dinámica según el rol */}
      {isAuthenticated && user?.rol === 'ADMIN' ? (
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          currentPath={currentPath}
          onNavigate={handleNavigation}
        />
      ) : (
        <PublicNavbar
          user={user}
          isAuthenticated={isAuthenticated}
          onLogin={handleLoginNavigation}
          onLogout={handleLogout}
          currentPath={currentPath}
          onNavigate={handleNavigation}
        />
      )}

      {/* Scroll to top component */}
      <div id="scroll-to-top" />

      {/* Contenido principal */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <FooterComp />
    </div>
  );
}

export default App;