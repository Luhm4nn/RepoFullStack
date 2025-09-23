import { useState } from 'react';

const RegisterForm = ({ onRegister, onNavigateToLogin, onNavigateHome, loading = false }) => {
  const [formData, setFormData] = useState({
    DNI: '',
    nombreUsuario: '',
    apellidoUsuario: '',
    email: '',
    contrasena: '',
    confirmPassword: '',
    telefono: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error'); // 'error' or 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    // DNI
    if (!formData.DNI.trim()) {
      newErrors.DNI = 'El DNI es requerido';
    } else if (!/^\d{7,8}$/.test(formData.DNI.trim())) {
      newErrors.DNI = 'El DNI debe tener 7 u 8 dígitos';
    }

    // Nombre
    if (!formData.nombreUsuario.trim()) {
      newErrors.nombreUsuario = 'El nombre es requerido';
    } else if (formData.nombreUsuario.trim().length < 2) {
      newErrors.nombreUsuario = 'El nombre debe tener al menos 2 caracteres';
    }

    // Apellido
    if (!formData.apellidoUsuario.trim()) {
      newErrors.apellidoUsuario = 'El apellido es requerido';
    } else if (formData.apellidoUsuario.trim().length < 2) {
      newErrors.apellidoUsuario = 'El apellido debe tener al menos 2 caracteres';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Password
    if (!formData.contrasena.trim()) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Confirm Password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.contrasena !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Teléfono (opcional pero si se ingresa debe ser válido)
    if (formData.telefono.trim() && !/^\d{8,15}$/.test(formData.telefono.trim())) {
      newErrors.telefono = 'El teléfono debe tener entre 8 y 15 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setShowAlert(false);

    try {
      if (onRegister) {
        // Preparar datos para enviar (sin confirmPassword)
        const { confirmPassword, ...dataToSend } = formData;
        const result = await onRegister(dataToSend);
        
        if (result.success) {
          setAlertType('success');
          setAlertMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
          setShowAlert(true);
          
          // Limpiar formulario
          setFormData({
            DNI: '',
            nombreUsuario: '',
            apellidoUsuario: '',
            email: '',
            contrasena: '',
            confirmPassword: '',
            telefono: ''
          });
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            if (onNavigateToLogin) onNavigateToLogin();
          }, 2000);
        } else {
          setAlertType('error');
          setAlertMessage(result.error || 'Error en el registro');
          setShowAlert(true);
        }
      }
    } catch (error) {
      console.error('Error en submit:', error);
      setAlertType('error');
      setAlertMessage('Error inesperado. Intenta nuevamente.');
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-gray-400">Únete para disfrutar del mejor cine</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 shadow-2xl">
          {/* Alert */}
          {showAlert && (
            <div className={`mb-6 p-4 border rounded-lg flex items-start gap-3 ${
              alertType === 'success' 
                ? 'bg-green-900/20 border-green-500/20 text-green-400' 
                : 'bg-red-900/20 border-red-500/20 text-red-400'
            }`}>
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                {alertType === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.25a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                )}
              </svg>
              <div className="flex-1">
                {alertMessage}
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className={`${alertType === 'success' ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          <div className="space-y-4">
            {/* DNI */}
            <div>
              <label htmlFor="DNI" className="text-white mb-2 block font-medium">
                DNI *
              </label>
              <input
                id="DNI"
                name="DNI"
                type="text"
                placeholder="12345678"
                value={formData.DNI}
                onChange={handleInputChange}
                disabled={isSubmitting || loading}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  errors.DNI 
                    ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {errors.DNI && (
                <p className="mt-1 text-sm text-red-400">{errors.DNI}</p>
              )}
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombreUsuario" className="text-white mb-2 block font-medium">
                  Nombre *
                </label>
                <input
                  id="nombreUsuario"
                  name="nombreUsuario"
                  type="text"
                  placeholder="Juan"
                  value={formData.nombreUsuario}
                  onChange={handleInputChange}
                  disabled={isSubmitting || loading}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    errors.nombreUsuario 
                      ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {errors.nombreUsuario && (
                  <p className="mt-1 text-sm text-red-400">{errors.nombreUsuario}</p>
                )}
              </div>

              <div>
                <label htmlFor="apellidoUsuario" className="text-white mb-2 block font-medium">
                  Apellido *
                </label>
                <input
                  id="apellidoUsuario"
                  name="apellidoUsuario"
                  type="text"
                  placeholder="Pérez"
                  value={formData.apellidoUsuario}
                  onChange={handleInputChange}
                  disabled={isSubmitting || loading}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    errors.apellidoUsuario 
                      ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {errors.apellidoUsuario && (
                  <p className="mt-1 text-sm text-red-400">{errors.apellidoUsuario}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-white mb-2 block font-medium">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting || loading}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  errors.email 
                    ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="text-white mb-2 block font-medium">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="text"
                placeholder="3411234567 (opcional)"
                value={formData.telefono}
                onChange={handleInputChange}
                disabled={isSubmitting || loading}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  errors.telefono 
                    ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-400">{errors.telefono}</p>
              )}
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contrasena" className="text-white mb-2 block font-medium">
                  Contraseña *
                </label>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  placeholder="••••••••"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  disabled={isSubmitting || loading}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    errors.contrasena 
                      ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {errors.contrasena && (
                  <p className="mt-1 text-sm text-red-400">{errors.contrasena}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-white mb-2 block font-medium">
                  Confirmar *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isSubmitting || loading}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    errors.confirmPassword 
                      ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                      : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:ring-4 focus:ring-green-300 font-medium text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </div>
              ) : (
                "Crear Cuenta"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1 h-px bg-slate-600"></div>
              <span className="text-gray-400 text-sm">o</span>
              <div className="flex-1 h-px bg-slate-600"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-400 mb-2">¿Ya tienes una cuenta?</p>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Inicia sesión aquí
              </button>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2024 Cinema App. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;