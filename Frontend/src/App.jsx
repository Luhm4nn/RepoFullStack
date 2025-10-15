import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminNavbar from './modules/admin/components/AdminNavbar';
import PublicNavbar from './modules/shared/components/PublicNavbar';
import { UserNavbar } from './modules/user/components';
import NotFound from './modules/shared/pages/NotFound.jsx';
import PeliculasPage from './modules/admin/pages/PeliculasPage.jsx';
import DashboardPage from './modules/admin/pages/DashboardPage.jsx';
import ConfiguracionPage from './modules/admin/pages/ConfiguracionPage.jsx';
import FuncionesPage from './modules/admin/pages/FuncionesPage.jsx';
import SalasPage from './modules/admin/pages/SalasPage.jsx';
import FooterComp from './modules/shared/components/FooterComp';
import Terminos from './modules/shared/pages/FooterPages/Terminos';
import Privacity from './modules/shared/pages/FooterPages/Privacity';
import AboutMe from './modules/shared/pages/FooterPages/AboutMe';
import FAQ from './modules/shared/pages/FooterPages/FAQ';
import LoginPage from './modules/shared/pages/LoginPage.jsx';
import RegisterPage from './modules/user/pages/RegisterPage.jsx';
import ReservaPage from './modules/user/pages/ReservaPage.jsx';
import MisReservasPage from './modules/user/pages/MisReservasPage.jsx';
import CarteleraPage from './modules/shared/pages/CarteleraPage.jsx';
import ScrollToTop from './modules/shared/components/ScrollToTop';
import { useAuth } from './modules/shared/hooks/useAuth.js';
import ProtectedRoute from './modules/shared/components/ProtectedRoute';
import { AuthenticatedRoute, AdminRoute } from './modules/shared';
import ReservaSuccessPage from './modules/user/pages/ReservaSuccessPage.jsx';
import ReservaFailurePage from './modules/user/pages/ReservaFailurePage.jsx';
import ReservaPendingPage from './modules/user/pages/ReservaPendingPage.jsx';
// Si necesitas AdminRoute y AuthenticatedRoute, exportalos desde ProtectedRoute.jsx


function NavbarWrapper() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (isAuthenticated && user?.rol && user.rol.trim().toUpperCase() === 'ADMIN') {
    return <AdminNavbar user={user} onLogout={logout} currentPath={location.pathname} />;
  }
  if (isAuthenticated && user?.rol && user.rol.trim().toUpperCase() === 'CLIENTE') {
    return <UserNavbar user={user} onLogout={logout} currentPath={location.pathname} />;
  }
  return <PublicNavbar user={user} isAuthenticated={isAuthenticated} onLogout={logout} currentPath={location.pathname} />;
}

function AppRoutes() {
  const { user, isAuthenticated, loading, login, logout, register } = useAuth();
  return (
    <Routes>
  <Route path="/" element={<CarteleraPage />} />
      <Route path="/login" element={<LoginPage onLogin={login} user={user} isAuthenticated={isAuthenticated} loading={loading} />} />
      <Route path="/register" element={<RegisterPage onRegister={register} loading={loading} />} />
  <Route path="/Cartelera" element={<CarteleraPage />} />
      <Route path="/MiPerfil" element={<AuthenticatedRoute><div>Mi Perfil Page - Por implementar</div></AuthenticatedRoute>} />
      <Route path="/reserva/success" element={<ReservaSuccessPage />} />
      <Route path="/reserva/failure" element={<ReservaFailurePage />} />
      <Route path="/reserva/pending" element={<ReservaPendingPage />} />
      <Route path="/MisReservas" element={<AuthenticatedRoute><div><MisReservasPage/></div></AuthenticatedRoute>} />
  <Route path="/Reservar/:id" element={<AuthenticatedRoute><ReservaPage /></AuthenticatedRoute>} />
  <Route path="/Dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
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