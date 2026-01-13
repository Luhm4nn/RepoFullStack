import { useState, useCallback, useEffect } from 'react';
import { getPeliculas } from '../../../api/Peliculas.api';
import { useDebounce } from '../../../utils/debounce.js';

export const usePeliculasFilter = (
  peliculasSinFiltrar, 
  setPeliculas,
  currentPage = 1,
  itemsPerPage = 10,
  onPaginationChange
) => {
  const [filtros, setFiltros] = useState({
    busqueda: '',
    genero: ''
  });
  
  // Debounce de los filtros de texto para no hacer tantas peticiones
  const debouncedBusqueda = useDebounce(filtros.busqueda, 500);

  const aplicarFiltros = useCallback(async (page = 1) => {
    try {
      const backendFiltros = {
        page,
        limit: itemsPerPage
      };

      // Solo agregar filtros si tienen valor
      if (debouncedBusqueda?.trim()) {
        backendFiltros.busqueda = debouncedBusqueda.trim();
      }
      
      if (filtros.genero?.trim()) {
        backendFiltros.genero = filtros.genero.trim();
      }
      
      const response = await getPeliculas(backendFiltros);
      
      // Si hay paginación, actualizar
      if (response.data && response.pagination) {
        setPeliculas(response.data);
        if (onPaginationChange) {
          onPaginationChange(response.pagination, page);
        }
      } else {
        // Backward compatibility: si no hay paginación, usar respuesta directa
        setPeliculas(response);
      }
    } catch (error) {
      setPeliculas([]);
      if (onPaginationChange) {
        onPaginationChange(null, 1);
      }
    }
  }, [debouncedBusqueda, filtros.genero, setPeliculas, itemsPerPage, onPaginationChange]);

  const limpiarFiltros = useCallback(() => {
    setFiltros({
      busqueda: '',
      genero: ''
    });
    // Resetear a página 1 y cargar sin filtros
    aplicarFiltros(1);
  }, [aplicarFiltros]);

  // Auto-aplicar filtros cuando cambien los valores debounced
  useEffect(() => {
    // Cuando cambian filtros, volver a página 1
    aplicarFiltros(1);
  }, [debouncedBusqueda, filtros.genero]);

  // Simple handlers that just update the filter state
  const handleBusquedaChange = useCallback((valor) => {
    setFiltros(prev => ({ ...prev, busqueda: valor }));
  }, []);

  const handleGeneroChange = useCallback((valor) => {
    setFiltros(prev => ({ ...prev, genero: valor }));
  }, []);

  const handleFilterChange = useCallback((campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }, []);

  return {
    filtros,
    aplicarFiltros,
    limpiarFiltros,
    handleBusquedaChange,
    handleGeneroChange,
    handleFilterChange
  };
};
