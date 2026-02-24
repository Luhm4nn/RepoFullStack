import { RegisterForm } from '../../shared';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const handleRegister = async (userData) => {
    try {
      if (register) {
        return await register(userData);
      }
      return { success: false, error: 'No register handler provided' };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error en el registro',
      };
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <RegisterForm
      onRegister={handleRegister}
      onNavigateToLogin={handleNavigateToLogin}
      onNavigateHome={handleNavigateHome}
      loading={loading}
    />
  );
};

export default RegisterPage;
