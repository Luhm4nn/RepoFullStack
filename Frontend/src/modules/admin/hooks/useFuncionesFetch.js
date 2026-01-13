import { useState, useEffect } from 'react';
import { getFunciones, deleteFuncion, updateFuncion } from '../../../api/Funciones.api';
import useErrorModal from '../../shared/hooks/useErrorModal.js';

export const useFuncionesFetch = (mostrandoActivas = true) => {
  const [funciones, setFunciones] = useState([]);
  const [funcionesSinFiltrar, setFuncionesSinFiltrar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const itemsPerPage = 10;
  
  const { error: modalError, handleApiError, hideError } = useErrorModal();

  const fetchFunciones = async (page = 1) => {
    try {
      setLoading(true);
      
      const params = {
        estado: mostrandoActivas ? 'activas' : 'inactivas',
        page,
        limit: itemsPerPage
      };

      const response = await getFunciones(params);
      
      // El backend devuelve { data, pagination }
      setFunciones(response.data);
      setFuncionesSinFiltrar(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
      setError(null);
    } catch (error) {
      setError(error.message);
      setFunciones([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // No llamar fetchFunciones aquí, será llamado por useFuncionesFilter
  };

  const handlePaginationChange = (newPagination, newPage) => {
    setPagination(newPagination);
    setCurrentPage(newPage);
  };
  const handleDeleteFuncion = async (funcionToDelete) => {
    try {
      const idSala = funcionToDelete.idSala;
      const fechaHoraFuncion = funcionToDelete.fechaHoraFuncion;

      await deleteFuncion(idSala, fechaHoraFuncion);
      await fetchFunciones(currentPage);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error eliminando función' };
    }
  };

  const handleUpdateFuncion = async (funcionOriginal, funcionActualizada) => {
    try {
      const idSalaOriginal = funcionOriginal.idSala;
      const fechaHoraOriginal = funcionOriginal.fechaHoraFuncion;
      
      await updateFuncion(idSalaOriginal, fechaHoraOriginal, funcionActualizada);
      await fetchFunciones(currentPage);
      return { success: true };
    } catch (error) {
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
    setCurrentPage(1);
    setPagination(null);
    fetchFunciones(1);
  }, [mostrandoActivas]);

  return {
    // Data
    funciones,
    setFunciones,
    funcionesSinFiltrar,
    loading,
    error,
    modalError,
    hideError,
    
    // Paginación
    currentPage,
    pagination,
    handlePageChange,
    handlePaginationChange,
    itemsPerPage,
    
    // Actions
    fetchFunciones,
    handleDeleteFuncion,
    handleUpdateFuncion,
    handlePublishFuncion
  };
};
