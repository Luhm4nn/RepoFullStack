import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminNavbar from "./modules/admin/components/AdminNavbar";
import PublicNavbar from "./modules/shared/components/PublicNavbar";
import { UserNavbar } from "./modules/user/components";
import NotFound from "./modules/shared/pages/NotFound.jsx";
import PeliculasPage from "./modules/admin/pages/PeliculasPage.jsx";
import DashboardPage from "./modules/admin/pages/DashboardPage.jsx";
import ConfiguracionPage from "./modules/admin/pages/ConfiguracionPage.jsx";
import FuncionesPage from "./modules/admin/pages/FuncionesPage.jsx";
import SalasPage from "./modules/admin/pages/SalasPage.jsx";
import FooterComp from "./modules/shared/components/FooterComp";
import Terminos from "./modules/shared/pages/FooterPages/Terminos";
import Privacity from "./modules/shared/pages/FooterPages/Privacity";
import AboutMe from "./modules/shared/pages/FooterPages/AboutMe";
import FAQ from "./modules/shared/pages/FooterPages/FAQ";
import LoginPage from "./modules/shared/pages/LoginPage.jsx";
import RegisterPage from "./modules/user/pages/RegisterPage.jsx";
import ReservaPage from "./modules/user/pages/ReservaPage.jsx";
import MisReservasPage from "./modules/user/pages/MisReservasPage.jsx";
import CarteleraPage from "./modules/shared/pages/CarteleraPage.jsx";
import ScannerPage from "./modules/scanner/pages/ScannerPage.jsx";
import ScrollToTop from "./modules/shared/components/ScrollToTop";
import { useAuth } from "./modules/shared/hooks/useAuth.js";
import { AuthenticatedRoute, AdminRoute, ScannerRoute } from "./modules/shared";
import ReservaSuccessPage from "./modules/user/pages/ReservaSuccessPage.jsx";
import ReservaFailurePage from "./modules/user/pages/ReservaFailurePage.jsx";
import ReservaPendingPage from "./modules/user/pages/ReservaPendingPage.jsx";
import MiPerfilPage from "./modules/user/pages/MiPerfilPage.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import ScannerNavbar from "./modules/scanner/components/ScannerNavbar.jsx";
import { useReservaCleanup } from "./modules/user/hooks/useReservaCleanup.js";

function NavbarWrapper() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (
    isAuthenticated &&
    user?.rol &&
    user.rol.trim().toUpperCase() === "ADMIN"
  ) {
    return (
      <AdminNavbar
        user={user}
        onLogout={logout}
        currentPath={location.pathname}
      />
    );
  }
  if (
    isAuthenticated &&
    user?.rol &&
    user.rol.trim().toUpperCase() === "CLIENTE"
  ) {
    return (
      <UserNavbar
        user={user}
        onLogout={logout}
        currentPath={location.pathname}
      />
    );
  }
  if (
      isAuthenticated &&
      user?.rol &&
      user.rol.trim().toUpperCase() === "ESCANER"
    ) {
      return (
        <ScannerNavbar
          user={user}
          onLogout={logout}
          currentPath={location.pathname}
        />
      );
    }

  return (
    <PublicNavbar
      user={user}
      isAuthenticated={isAuthenticated}
      onLogout={logout}
      currentPath={location.pathname}
    />
  );
}

function AppRoutes() {
  const { user, isAuthenticated, loading, login, logout, register } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<CarteleraPage />} />
      <Route
        path="/login"
        element={
          <LoginPage

            onLogin={login}
            user={user}
            isAuthenticated={isAuthenticated}
            loading={loading}
            logout={logout}
          />
        }
      />
      <Route
        path="/register"
        element={<RegisterPage onRegister={register} loading={loading} />}
      />
      <Route path="/cartelera" element={<CarteleraPage />} />
      <Route path="/reserva/success" element={<ReservaSuccessPage />} />
      <Route path="/reserva/failure" element={<ReservaFailurePage />} />
      <Route path="/reserva/pending" element={<ReservaPendingPage />} />
      <Route
        path="/mi-perfil"
        element={
          <AuthenticatedRoute>
            <MiPerfilPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/mis-reservas"
        element={
          <AuthenticatedRoute>
            <div>
              <MisReservasPage />
            </div>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/reservar/:id"
        element={
          <AuthenticatedRoute>
            <ReservaPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/peliculas"
        element={
          <AdminRoute>
            <PeliculasPage />
          </AdminRoute>
        }
      />
      <Route
        path="/salas"
        element={
          <AdminRoute>
            <SalasPage />
          </AdminRoute>
        }
      />
      <Route
        path="/funciones"
        element={
          <AdminRoute>
            <FuncionesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/configuracion"
        element={
          <AdminRoute>
            <ConfiguracionPage />
          </AdminRoute>
        }
      />
      <Route
        path="/scanner"
        element={
          <ScannerRoute>
            <ScannerPage />
          </ScannerRoute>
        }
      />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/privacity" element={<Privacity />} />
      <Route path="/about-me" element={<AboutMe />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  useReservaCleanup();
  return (
    <NotificationProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-montserrat">
        <NavbarWrapper />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <FooterComp />
      </div>
    </NotificationProvider>
  );
}

export default App;
