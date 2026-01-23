import { createContext, useContext, useEffect } from 'react';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { useErrorModal } from '../modules/shared';

const NotificationContext = createContext();

/**
 * NotificationProvider
 * Sistema híbrido que combina:
 * - React Hot Toast para notificaciones simples
 * - ErrorModal existente para errores de lógica de negocio
 */
export function NotificationProvider({ children }) {
  const { handleApiError: handleBusinessError } = useErrorModal();
  const { toasts } = useToasterStore();
  const TOAST_LIMIT = 3;

  /**
   * Limita el número de notificaciones visibles simultáneamente
   */
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Solo considerar los visibles
      .filter((_, i) => i >= TOAST_LIMIT) // Identificar los que exceden el límite
      .forEach((t) => toast.dismiss(t.id)); // Cerrar los excedentes
  }, [toasts]);

  const notify = {
    /**
     * Notificación de éxito
     * @param {string} message - Mensaje a mostrar
     * @param {Object} options - Opciones adicionales de react-hot-toast
     */
    success: (message, options = {}) => {
      toast.success(message, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10b981',
          color: '#fff',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
        ...options,
      });
    },

    /**
     * Notificación de error simple
     * @param {string} message - Mensaje de error
     * @param {Object} options - Opciones adicionales
     */
    error: (message, options = {}) => {
      toast.error(message, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
        ...options,
      });
    },

    /**
     * Notificación de advertencia
     * @param {string} message - Mensaje de advertencia
     * @param {Object} options - Opciones adicionales
     */
    warning: (message, options = {}) => {
      toast(message, {
        icon: '⚠️',
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#f59e0b',
          color: '#fff',
          fontWeight: '500',
        },
        ...options,
      });
    },

    /**
     * Notificación informativa
     * @param {string} message - Mensaje informativo
     * @param {Object} options - Opciones adicionales
     */
    info: (message, options = {}) => {
      toast(message, {
        icon: 'ℹ️',
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#3b82f6',
          color: '#fff',
          fontWeight: '500',
        },
        ...options,
      });
    },

    /**
     * Toast con promise (loading, success, error automático)
     * @param {Promise} promise - Promesa a ejecutar
     * @param {Object} messages - Mensajes { loading, success, error }
     * @param {Object} options - Opciones adicionales
     */
    promise: (promise, messages, options = {}) => {
      return toast.promise(
        promise,
        {
          loading: messages.loading || 'Cargando...',
          success: messages.success || 'Completado',
          error: messages.error || 'Error',
        },
        {
          position: 'top-center',
          style: {
            fontWeight: '500',
          },
          ...options,
        }
      );
    },

    /**
     * Manejo inteligente de errores API
     * Primero intenta con ErrorModal (errores de negocio)
     * Si no es error de negocio, muestra toast simple
     * @param {Error} error - Error de API
     * @returns {boolean} - true si fue manejado por ErrorModal
     */
    handleError: (error) => {
      // Primero intenta con el modal de negocio
      const wasBusinessError = handleBusinessError(error);

      if (!wasBusinessError) {
        // Si no es error de negocio, usa toast simple
        const message =
          error.response?.data?.message || error.message || 'Ocurrió un error inesperado';

        toast.error(message, {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: '500',
          },
        });
      }

      return wasBusinessError;
    },
  };

  return (
    <NotificationContext.Provider value={notify}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Estilos globales
          className: '',
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
            padding: '16px',
            borderRadius: '8px',
          },
        }}
      />
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook para usar el sistema de notificaciones
 * @returns {Object} Funciones de notificación
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider');
  }
  return context;
};
