import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useAuth } from "../../shared/hooks/useAuth";
import { editProfileSchema, changePasswordSchema } from "../../../validations/UsuariosSchema";
import { notifyGlobal } from "../../../context/NotificationContext";
import { CenteredSpinner } from "../../shared/components/Spinner";
import { usuariosAPI } from "../../../api/usuarios.api";

export default function EditarPerfilPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general"); // "general" or "security"

  const initialValuesGeneral = {
    nombreUsuario: user?.nombreUsuario || "",
    apellidoUsuario: user?.apellidoUsuario || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
  };

  const initialValuesSecurity = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  if (authLoading) return <CenteredSpinner />;

  const onUpdateProfile = async (values, { setSubmitting }) => {
    try {
      const updatedUser = await usuariosAPI.updateProfile(values);
      updateUser(updatedUser);
      notifyGlobal.success("Perfil actualizado correctamente");
    } catch (error) {
      notifyGlobal.error(error.message || "Error al actualizar perfil");
    } finally {
      setSubmitting(false);
    }
  };

  const onChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      await usuariosAPI.changePassword(
        values.currentPassword,
        values.newPassword,
        values.confirmNewPassword
      );
      notifyGlobal.success("Contraseña actualizada correctamente");
      resetForm();
    } catch (error) {
      notifyGlobal.error(error.message || "Error al cambiar contraseña");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/mi-perfil")}
          className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" fillRule="evenodd" />
          </svg>
          Volver al perfil
        </button>

        <h1 className="text-3xl font-bold text-white mb-8 text-center sm:text-left">Configuración de Cuenta</h1>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "general"
                  ? "text-purple-400 border-b-2 border-purple-400 bg-purple-400/5"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Información General
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === "security"
                  ? "text-purple-400 border-b-2 border-purple-400 bg-purple-400/5"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Seguridad
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "general" ? (
              <Formik
                initialValues={initialValuesGeneral}
                validationSchema={editProfileSchema}
                onSubmit={onUpdateProfile}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                        <Field
                          name="nombreUsuario"
                          className={`w-full bg-slate-800 border ${errors.nombreUsuario && touched.nombreUsuario ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                          placeholder="Tu nombre"
                        />
                        {errors.nombreUsuario && touched.nombreUsuario && (
                          <p className="mt-1 text-xs text-red-400">{errors.nombreUsuario}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Apellido</label>
                        <Field
                          name="apellidoUsuario"
                          className={`w-full bg-slate-800 border ${errors.apellidoUsuario && touched.apellidoUsuario ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                          placeholder="Tu apellido"
                        />
                        {errors.apellidoUsuario && touched.apellidoUsuario && (
                          <p className="mt-1 text-xs text-red-400">{errors.apellidoUsuario}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
                      <Field
                        name="email"
                        className={`w-full bg-slate-800 border ${errors.email && touched.email ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono`}
                        placeholder="ejemplo@correo.com"
                      />
                      {errors.email && touched.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500 italic">
                        * Cambiar tu email afectará tu próximo inicio de sesión.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Teléfono (Opcional)</label>
                      <Field
                        name="telefono"
                        className={`w-full bg-slate-800 border ${errors.telefono && touched.telefono ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                        placeholder="Número de contacto"
                      />
                      {errors.telefono && touched.telefono && (
                        <p className="mt-1 text-xs text-red-400">{errors.telefono}</p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={initialValuesSecurity}
                validationSchema={changePasswordSchema}
                onSubmit={onChangePassword}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Contraseña Actual</label>
                      <Field
                        type="password"
                        name="currentPassword"
                        className={`w-full bg-slate-800 border ${errors.currentPassword && touched.currentPassword ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono`}
                        placeholder="••••••••"
                      />
                      {errors.currentPassword && touched.currentPassword && (
                        <p className="mt-1 text-xs text-red-400">{errors.currentPassword}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nueva Contraseña</label>
                        <Field
                          type="password"
                          name="newPassword"
                          className={`w-full bg-slate-800 border ${errors.newPassword && touched.newPassword ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono`}
                          placeholder="••••••••"
                        />
                        {errors.newPassword && touched.newPassword && (
                          <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirmar Nueva Contraseña</label>
                        <Field
                          type="password"
                          name="confirmNewPassword"
                          className={`w-full bg-slate-800 border ${errors.confirmNewPassword && touched.confirmNewPassword ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono`}
                          placeholder="••••••••"
                        />
                        {errors.confirmNewPassword && touched.confirmNewPassword && (
                          <p className="mt-1 text-xs text-red-400">{errors.confirmNewPassword}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-purple-900/20"
                      >
                        {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-gray-500 text-xs text-white/40">
          © 2026 Cutzy Cinema • Tu seguridad es nuestra prioridad.
        </p>
      </div>
    </div>
  );
}
