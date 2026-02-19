import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { registerSchema } from '../../../validations/UsuariosSchema';
import { ButtonSpinner } from './Spinner';
import { notifyGlobal } from '../../../context/NotificationContext';

const RegisterForm = ({ onRegister, onNavigateToLogin, onNavigateHome, loading = false }) => {
  const [showAlert, setShowAlert] = useState(false);
  const initialValues = {
    DNI: '',
    nombreUsuario: '',
    apellidoUsuario: '',
    email: '',
    contrasena: '',
    confirmPassword: '',
    telefono: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setShowAlert(false);
    try {
      const { confirmPassword, ...dataToSend } = values;
      const result = onRegister
        ? await onRegister(dataToSend)
        : { success: false, error: 'No register handler provided' };
      if (result.success) {
        notifyGlobal.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
        resetForm();
        if (onNavigateToLogin) onNavigateToLogin();
      } else {
        notifyGlobal.error(result.error || 'Error en el registro');
      }
    } catch (error) {
      notifyGlobal.error('Error inesperado. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-gray-400">Únete para disfrutar del mejor cine</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 shadow-2xl">
              {/* Alert - Solo para errores */}
              {showAlert && alertType === 'error' && (
                <div className="mb-6 p-4 border rounded-lg flex items-start gap-3 bg-red-900/20 border-red-500/20 text-red-400">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">{alertMessage}</div>
                  <button
                    onClick={() => setShowAlert(false)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
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
                  <Field
                    id="DNI"
                    name="DNI"
                    type="text"
                    placeholder="12345678"
                    disabled={isSubmitting || loading}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      errors.DNI && touched.DNI
                        ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {errors.DNI && touched.DNI && (
                    <p className="mt-1 text-sm text-red-400">{errors.DNI}</p>
                  )}
                </div>

                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombreUsuario" className="text-white mb-2 block font-medium">
                      Nombre *
                    </label>
                    <Field
                      id="nombreUsuario"
                      name="nombreUsuario"
                      type="text"
                      placeholder="Juan"
                      disabled={isSubmitting || loading}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        errors.nombreUsuario && touched.nombreUsuario
                          ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {errors.nombreUsuario && touched.nombreUsuario && (
                      <p className="mt-1 text-sm text-red-400">{errors.nombreUsuario}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="apellidoUsuario" className="text-white mb-2 block font-medium">
                      Apellido *
                    </label>
                    <Field
                      id="apellidoUsuario"
                      name="apellidoUsuario"
                      type="text"
                      placeholder="Pérez"
                      disabled={isSubmitting || loading}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        errors.apellidoUsuario && touched.apellidoUsuario
                          ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {errors.apellidoUsuario && touched.apellidoUsuario && (
                      <p className="mt-1 text-sm text-red-400">{errors.apellidoUsuario}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-white mb-2 block font-medium">
                    Email *
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    disabled={isSubmitting || loading}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      errors.email && touched.email
                        ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="text-white mb-2 block font-medium">
                    Teléfono
                  </label>
                  <Field
                    id="telefono"
                    name="telefono"
                    type="text"
                    placeholder="3411234567 (opcional)"
                    disabled={isSubmitting || loading}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      errors.telefono && touched.telefono
                        ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  {errors.telefono && touched.telefono && (
                    <p className="mt-1 text-sm text-red-400">{errors.telefono}</p>
                  )}
                </div>

                {/* Contraseñas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contrasena" className="text-white mb-2 block font-medium">
                      Contraseña *
                    </label>
                    <Field
                      id="contrasena"
                      name="contrasena"
                      type="password"
                      placeholder="••••••••"
                      disabled={isSubmitting || loading}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        errors.contrasena && touched.contrasena
                          ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {errors.contrasena && touched.contrasena && (
                      <p className="mt-1 text-sm text-red-400">{errors.contrasena}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="text-white mb-2 block font-medium">
                      Confirmar *
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      disabled={isSubmitting || loading}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        errors.confirmPassword && touched.confirmPassword
                          ? 'bg-slate-700 border-red-500 text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:ring-4 focus:ring-green-300 font-medium text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <ButtonSpinner size="sm" />
                      Creando cuenta...
                    </div>
                  ) : (
                    'Crear Cuenta'
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                      />
                    </svg>
                    Volver al inicio
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>©026 Cutzy Cinema. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
