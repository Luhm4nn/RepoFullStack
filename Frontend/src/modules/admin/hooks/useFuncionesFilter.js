import { useState, useCallback, useEffect } from 'react';
import { getFunciones } from '../../../api/Funciones.api';
import { useDebounce } from '../../../utils/debounce.js';

export const useFuncionesFilter = (
  funcionesSinFiltrar, 
  setFunciones, 
  mostrandoActivas = true,
  currentPage = 1,
  itemsPerPage = 10,
  onPaginationChange
) => {
  const [filtros, setFiltros] = useState({
    pelicula: '',
    sala: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  
  // Debounce de los filtros de texto para no hacer tantas peticiones
  const debouncedPelicula = useDebounce(filtros.pelicula, 500);
  const debouncedSala = useDebounce(filtros.sala, 500);

  const aplicarFiltros = useCallback(async (page = 1) => {
    try {
      const backendFiltros = {
        estado: mostrandoActivas ? 'activas' : 'inactivas',
        page,
        limit: itemsPerPage
      };

      // Solo agregar filtros si tienen valor
      if (debouncedPelicula?.trim()) {
        backendFiltros.nombrePelicula = debouncedPelicula.trim();
      }
      
      if (debouncedSala?.trim()) {
        backendFiltros.nombreSala = debouncedSala.trim();
      }
      
      if (filtros.fechaDesde) {
        backendFiltros.fechaDesde = filtros.fechaDesde;
      }
      if (filtros.fechaHasta) {
        backendFiltros.fechaHasta = filtros.fechaHasta;
      }
      
      const response = await getFunciones(backendFiltros);
      
      // Si hay paginación, actualizar
      if (response?.data && response?.pagination) {
        const funcionesArray = Array.isArray(response.data) ? response.data : [];
        setFunciones(funcionesArray);
        if (onPaginationChange) {
          onPaginationChange(response.pagination, page);
        }
      } else {
        // Backward compatibility: si no hay paginación, usar respuesta directa
        const funcionesArray = Array.isArray(response) ? response : [];
        setFunciones(funcionesArray);
      }
    } catch (error) {
      console.error("Error aplicando filtros de funciones:", error);
      setFunciones([]);
      if (onPaginationChange) {
        onPaginationChange(null, 1);
      }
    }
  }, [debouncedPelicula, debouncedSala, filtros.fechaDesde, filtros.fechaHasta, mostrandoActivas, setFunciones, itemsPerPage, onPaginationChange]);

  const limpiarFiltros = useCallback(() => {
    setFiltros({
      pelicula: '',
      sala: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    // Resetear a página 1 y cargar sin filtros
    aplicarFiltros(1);
  }, [aplicarFiltros]);

  // Auto-aplicar filtros cuando cambien los valores debounced
  useEffect(() => {
    // Cuando cambian filtros, volver a página 1
    aplicarFiltros(1);
  }, [debouncedPelicula, debouncedSala, filtros.fechaDesde, filtros.fechaHasta, mostrandoActivas]);

  // Simple handlers that just update the filter state
  const handlePeliculaChange = useCallback((valor) => {
    setFiltros(prev => ({ ...prev, pelicula: valor }));
  }, []);

  const handleSalaChange = useCallback((valor) => {
    setFiltros(prev => ({ ...prev, sala: valor }));
  }, []);

  const handleFilterChange = useCallback((campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }, []);

  return {
    filtros,
    aplicarFiltros,
    limpiarFiltros,
    handlePeliculaChange,
    handleSalaChange,
    handleFilterChange
  };
};
