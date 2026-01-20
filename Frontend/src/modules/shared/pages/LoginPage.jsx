import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../shared/components/LoginForm";
import { CenteredSpinner } from "../components/Spinner";

const LoginPage = ({ onLogin, user, isAuthenticated, loading }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.rol === "ADMIN") {
        navigate("/dashboard", { replace: true });
      }
      else if (user.rol === "ESCANER") {
        navigate("/scanner", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (email, password) => {
    try {
      if (onLogin) {
        return await onLogin(email, password);
      }
      return { success: false, error: "No login handler provided" };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Error en el login",
      };
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <CenteredSpinner size="md" />
          <p className="text-white mt-4">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      onNavigateToRegister={handleNavigateToRegister}
      onNavigateHome={handleNavigateHome}
      loading={loading}
    />
  );
};

export default LoginPage;
