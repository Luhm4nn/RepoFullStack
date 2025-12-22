import { useState, useEffect } from 'react';
import { getFuncionesActivas, getFuncionesInactivas, deleteFuncion, updateFuncion } from '../../../api/Funciones.api';
import useErrorModal from '../../shared/hooks/useErrorModal.js';

export const useFuncionesFetch = (mostrandoActivas = true) => {
  const [funciones, setFunciones] = useState([]);
  const [funcionesSinFiltrar, setFuncionesSinFiltrar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { error: modalError, handleApiError, hideError } = useErrorModal();

  // Fetch functions based on active/inactive filter
  const fetchFunciones = async () => {
    try {
      setLoading(true);
      const funcionesData = mostrandoActivas ? await getFuncionesActivas() : await getFuncionesInactivas();
      setFunciones(funcionesData);
      setFuncionesSinFiltrar(funcionesData);
      setError(null);
    } catch (error) {
      console.error("Error fetching functions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete function
  const handleDeleteFuncion = async (funcionToDelete) => {
    try {
      const idSala = funcionToDelete.idSala;
      const fechaHoraFuncion = funcionToDelete.fechaHoraFuncion;

      await deleteFuncion(idSala, fechaHoraFuncion);
      await fetchFunciones();
      return { success: true };
    } catch (error) {
      console.error('Error eliminando función:', error);
      return { success: false, error: 'Error eliminando función' };
    }
  };

  // Update function (for publish/unpublish or edit)
  const handleUpdateFuncion = async (funcionOriginal, funcionActualizada) => {
    try {
      const idSalaOriginal = funcionOriginal.idSala;
      const fechaHoraOriginal = funcionOriginal.fechaHoraFuncion;
      
      await updateFuncion(idSalaOriginal, fechaHoraOriginal, funcionActualizada);
      await fetchFunciones();
      return { success: true };
    } catch (error) {
      console.error('Error actualizando función:', error);
      const wasHandled = handleApiError(error);
      if (!wasHandled) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        return { success: false, error: `Error actualizando función: ${errorMessage}` };
      }
      return { success: false, error: null }; // Error was handled by modal
    }
  };

  // Publish/unpublish function
  const handlePublishFuncion = async (funcionToPublish) => {
    const nuevoEstado = funcionToPublish.estado === 'Privada' ? 'Publica' : 'Privada';
    const funcionActualizada = {
      ...funcionToPublish,
      estado: nuevoEstado
    };
    
    return await handleUpdateFuncion(funcionToPublish, funcionActualizada);
  };

  useEffect(() => {
    fetchFunciones();
  }, [mostrandoActivas]);

  return {
    // Data
    funciones,
    setFunciones,
    funcionesSinFiltrar,
    setFuncionesSinFiltrar,
    loading,
    error,
    modalError,
    hideError,
    
    // Actions
    fetchFunciones,
    handleDeleteFuncion,
    handleUpdateFuncion,
    handlePublishFuncion
  };
};
