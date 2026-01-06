import { useState, useCallback, useEffect } from 'react';
import { getFunciones } from '../../../api/Funciones.api';
import { useDebounce } from '../../shared/utils/debounce.js';

export const useFuncionesFilter = (funcionesSinFiltrar, setFunciones, mostrandoActivas = true) => {
  const [filtros, setFiltros] = useState({
    pelicula: '',
    sala: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  
  // Debounce de los filtros de texto para no hacer tantas peticiones
  const debouncedPelicula = useDebounce(filtros.pelicula, 500);
  const debouncedSala = useDebounce(filtros.sala, 500);

  const aplicarFiltros = useCallback(async () => {
    try {
      if (!debouncedPelicula && !debouncedSala && !filtros.fechaDesde && !filtros.fechaHasta) {
        setFunciones(funcionesSinFiltrar);
        return;
      }

      const backendFiltros = {
        // Agregar estado según la pestaña actual
        estado: mostrandoActivas ? 'activas' : 'inactivas'
      };
      if (debouncedPelicula.trim()) {
        backendFiltros.nombrePelicula = debouncedPelicula.trim();
      }
      
      if (debouncedSala.trim()) {
        backendFiltros.nombreSala = debouncedSala.trim();
      }
      
      if (filtros.fechaDesde) {
        backendFiltros.fechaDesde = filtros.fechaDesde;
      }
      if (filtros.fechaHasta) {
        backendFiltros.fechaHasta = filtros.fechaHasta;
      }
      
      const funcionesFiltradas = await getFunciones(backendFiltros);
      setFunciones(funcionesFiltradas);
    } catch (error) {
      setFunciones(funcionesSinFiltrar);
    }
  }, [debouncedPelicula, debouncedSala, filtros.fechaDesde, filtros.fechaHasta, mostrandoActivas, setFunciones, funcionesSinFiltrar]);

  const limpiarFiltros = useCallback(() => {
    setFiltros({
      pelicula: '',
      sala: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    setFunciones(funcionesSinFiltrar);
  }, [funcionesSinFiltrar, setFunciones]);

  // Auto-aplicar filtros cuando cambien los valores debounced
  useEffect(() => {
    if (funcionesSinFiltrar.length > 0) {
      aplicarFiltros();
    }
  }, [debouncedPelicula, debouncedSala, filtros.fechaDesde, filtros.fechaHasta, mostrandoActivas, aplicarFiltros, funcionesSinFiltrar]);

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
