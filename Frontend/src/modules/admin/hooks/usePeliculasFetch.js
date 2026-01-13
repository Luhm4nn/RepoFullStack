import { useState, useEffect } from 'react';
import { getPeliculas, deletePelicula, updatePelicula } from '../../../api/Peliculas.api';
import useErrorModal from '../../shared/hooks/useErrorModal.js';

export const usePeliculasFetch = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasSinFiltrar, setPeliculasSinFiltrar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const itemsPerPage = 10;
  
  const { error: modalError, handleApiError, hideError } = useErrorModal();

  const fetchPeliculas = async (page = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: itemsPerPage
      };

      const response = await getPeliculas(params);
      
      // El backend devuelve { data, pagination }
      // Asegurar que data sea siempre un array
      setPeliculas(Array.isArray(response?.data) ? response.data : []);
      setPeliculasSinFiltrar(Array.isArray(response?.data) ? response.data : []);
      setPagination(response?.pagination || null);
      setCurrentPage(page);
      setError(null);
    } catch (error) {
      setError(error.message);
      setPeliculas([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // No llamar fetchPeliculas aquí, será llamado por usePeliculasFilter cuando esté implementado
  };

  const handlePaginationChange = (newPagination, newPage) => {
    setPagination(newPagination);
    setCurrentPage(newPage);
  };

  const handleDeletePelicula = async (peliculaToDelete) => {
    try {
      const id = peliculaToDelete.idPelicula;
      await deletePelicula(id);
      await fetchPeliculas(currentPage);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error eliminando película' };
    }
  };

  const handleUpdatePelicula = async (peliculaOriginal, peliculaActualizada) => {
    try {
      const id = peliculaOriginal.idPelicula;
      await updatePelicula(id, peliculaActualizada);
      await fetchPeliculas(currentPage);
      return { success: true };
    } catch (error) {
      const wasHandled = handleApiError(error);
      if (!wasHandled) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        return { success: false, error: `Error actualizando película: ${errorMessage}` };
      }
      return { success: false, error: null }; // Error was handled by modal
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setPagination(null);
    fetchPeliculas(1);
  }, []);

  return {
    peliculas,
    setPeliculas,
    peliculasSinFiltrar,
    loading,
    error,
    modalError,
    hideError,
    fetchPeliculas,
    handleDeletePelicula,
    handleUpdatePelicula,
    currentPage,
    pagination,
    handlePageChange,
    handlePaginationChange,
    itemsPerPage,
  };
};
import { getPeliculas, deletePelicula, updatePelicula } from '../../../api/Peliculas.api';
import useErrorModal from '../../shared/hooks/useErrorModal.js';

export const usePeliculasFetch = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasSinFiltrar, setPeliculasSinFiltrar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const itemsPerPage = 10;
  
  const { error: modalError, handleApiError, hideError } = useErrorModal();

  const fetchPeliculas = async (page = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: itemsPerPage
      };

      const response = await getPeliculas(params);
      
      // El backend devuelve { data, pagination }
      setPeliculas(response.data);
      setPeliculasSinFiltrar(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
      setError(null);
    } catch (error) {
      setError(error.message);
      setPeliculas([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // No llamar fetchPeliculas aquí, será llamado por usePeliculasFilter cuando esté implementado
  };

  const handlePaginationChange = (newPagination, newPage) => {
    setPagination(newPagination);
    setCurrentPage(newPage);
  };

  const handleDeletePelicula = async (peliculaToDelete) => {
    try {
      const id = peliculaToDelete.idPelicula;
      await deletePelicula(id);
      await fetchPeliculas(currentPage);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error eliminando película' };
    }
  };

  const handleUpdatePelicula = async (peliculaOriginal, peliculaActualizada) => {
    try {
      const id = peliculaOriginal.idPelicula;
      await updatePelicula(id, peliculaActualizada);
      await fetchPeliculas(currentPage);
      return { success: true };
    } catch (error) {
      const wasHandled = handleApiError(error);
      if (!wasHandled) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        return { success: false, error: `Error actualizando película: ${errorMessage}` };
      }
      return { success: false, error: null }; // Error was handled by modal
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setPagination(null);
    fetchPeliculas(1);
  }, []);

  return {
    peliculas,
    setPeliculas,
    peliculasSinFiltrar,
    loading,
    error,
    modalError,
    hideError,
    fetchPeliculas,
    handleDeletePelicula,
    handleUpdatePelicula,
    currentPage,
    pagination,
    handlePageChange,
    handlePaginationChange,
    itemsPerPage,
  };
};
