import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import ReservaPage from './pages/ReservaPage';
import CarteleraPage from './pages/CarteleraPage';
import ScrollToTop from './components/Shared/ScrollToTop';
import { useAuth } from './context/AuthContext';
import { AdminRoute, AuthenticatedRoute } from './components/ProtectedRoute';


function NavbarWrapper() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (isAuthenticated && user?.rol === 'ADMIN') {
    return <AdminNavbar user={user} onLogout={logout} currentPath={location.pathname} />;
  }
  return <PublicNavbar user={user} isAuthenticated={isAuthenticated} onLogout={logout} currentPath={location.pathname} />;
}

function AppRoutes() {
  const { user, isAuthenticated, loading, login, logout, register } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage onLogin={login} user={user} isAuthenticated={isAuthenticated} loading={loading} />} />
      <Route path="/register" element={<RegisterPage onRegister={register} loading={loading} />} />
  <Route path="/Cartelera" element={<CarteleraPage />} />
      <Route path="/MiPerfil" element={<AuthenticatedRoute><div>Mi Perfil Page - Por implementar</div></AuthenticatedRoute>} />
      <Route path="/MisReservas" element={<AuthenticatedRoute><div>Mis Reservas Page - Por implementar</div></AuthenticatedRoute>} />
  <Route path="/Reservar/:id" element={<AuthenticatedRoute><ReservaPage /></AuthenticatedRoute>} />
      <Route path="/Peliculas" element={<AdminRoute><PeliculasPage /></AdminRoute>} />
      <Route path="/Salas" element={<AdminRoute><SalasPage /></AdminRoute>} />
      <Route path="/Funciones" element={<AdminRoute><FuncionesPage /></AdminRoute>} />
      <Route path="/Configuracion" element={<AdminRoute><ConfiguracionPage /></AdminRoute>} />
      <Route path="/Terminos" element={<Terminos />} />
      <Route path="/Privacity" element={<Privacity />} />
      <Route path="/AboutMe" element={<AboutMe />} />
      <Route path="/FAQ" element={<FAQ />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-montserrat">
        <NavbarWrapper />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <FooterComp />
      </div>
    </>
  );
}

export default App;