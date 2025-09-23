import RegisterForm from '../components/RegisterForm';

const RegisterPage = ({ onRegister, onNavigateToLogin, onNavigateHome, loading = false }) => {

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
    if (onNavigateToLogin) onNavigateToLogin();
  };

  const handleNavigateHome = () => {
    if (onNavigateHome) onNavigateHome();
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