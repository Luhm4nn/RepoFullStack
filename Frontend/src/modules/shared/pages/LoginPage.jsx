import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../shared/components/LoginForm';

const LoginPage = ({ onLogin, user, isAuthenticated, loading }) => {
	const navigate = useNavigate();

		useEffect(() => {
			if (isAuthenticated && user) {
				if (user.rol === 'ADMIN') {
					navigate('/Dashboard', { replace: true });
				} else {
					navigate('/', { replace: true });
				}
			}
		}, [isAuthenticated, user, navigate]);

	const handleLogin = async (email, password) => {
		try {
			if (onLogin) {
				return await onLogin(email, password);
			}
			return { success: false, error: 'No login handler provided' };
		} catch (error) {
			return {
				success: false,
				error: error.message || 'Error en el login'
			};
		}
	};

	const handleNavigateToRegister = () => {
		navigate('/register');
	};

	const handleNavigateHome = () => {
		navigate('/');
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-white">Verificando sesión...</p>
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
