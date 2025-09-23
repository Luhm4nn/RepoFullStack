import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage = ({ onRegister, loading = false }) => {
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    try {
      if (onRegister) {
        return await onRegister(userData);
      }
      return { success: false, error: 'No register handler provided' };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error en el registro'
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