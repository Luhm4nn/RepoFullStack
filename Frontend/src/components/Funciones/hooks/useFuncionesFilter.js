import { useState, useCallback } from 'react';
import { debounce } from '../../../utils/debounce';
import { searchPeliculas } from '../../../api/Peliculas.api';
import { searchSalas } from '../../../api/Salas.api';

export const useFuncionesFilter = (funcionesSinFiltrar, setFunciones) => {
  const [filtros, setFiltros] = useState({
    pelicula: '',
    sala: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [peliculasSugeridas, setPeliculasSugeridas] = useState([]);
  const [salasSugeridas, setSalasSugeridas] = useState([]);
  const [mostrarSugerenciasPeliculas, setMostrarSugerenciasPeliculas] = useState(false);
  const [mostrarSugerenciasSalas, setMostrarSugerenciasSalas] = useState(false);

  // Apply filters to the functions list (synchronous)
  const aplicarFiltros = useCallback(() => {
    let funcionesFiltradas = [...funcionesSinFiltrar];

    // Filter by pelicula - check both search results and direct text match
    if (filtros.pelicula.trim()) {
      funcionesFiltradas = funcionesFiltradas.filter(funcion => {
        if (!funcion.pelicula?.nombrePelicula) return false;
        
        // Direct text match (case insensitive)
        const directMatch = funcion.pelicula.nombrePelicula.toLowerCase().includes(filtros.pelicula.toLowerCase());
        
        // Also check if it's in the suggestions
        const inSuggestions = peliculasSugeridas.some(p => p.idPelicula === funcion.idPelicula);
        
        return directMatch || inSuggestions;
      });
    }

    // Filter by sala - check both search results and direct text match  
    if (filtros.sala.trim()) {
      funcionesFiltradas = funcionesFiltradas.filter(funcion => {
        if (!funcion.sala?.nombreSala) return false;
        
        // Direct text match (case insensitive)
        const directMatch = funcion.sala.nombreSala.toLowerCase().includes(filtros.sala.toLowerCase());
        
        // Also check if it's in the suggestions
        const inSuggestions = salasSugeridas.some(s => s.idSala === funcion.idSala);
        
        return directMatch || inSuggestions;
      });
    }

    // Filter by date from (unchanged - no API needed)
    if (filtros.fechaDesde) {
      const fechaDesde = new Date(filtros.fechaDesde + 'T00:00:00');
      funcionesFiltradas = funcionesFiltradas.filter(
        funcion => new Date(funcion.fechaHoraFuncion) >= fechaDesde
      );
    }

    // Filter by date to (unchanged - no API needed)
    if (filtros.fechaHasta) {
      const fechaHasta = new Date(filtros.fechaHasta + 'T23:59:59');
      funcionesFiltradas = funcionesFiltradas.filter(
        funcion => new Date(funcion.fechaHoraFuncion) <= fechaHasta
      );
    }

    setFunciones(funcionesFiltradas);
  }, [filtros, funcionesSinFiltrar, peliculasSugeridas, salasSugeridas, setFunciones]);

  // Clear all filters
  const limpiarFiltros = useCallback(() => {
    setFiltros({
      pelicula: '',
      sala: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    setFunciones(funcionesSinFiltrar);
    setPeliculasSugeridas([]);
    setSalasSugeridas([]);
    setMostrarSugerenciasPeliculas(false);
    setMostrarSugerenciasSalas(false);
  }, [funcionesSinFiltrar, setFunciones]);

  // Handle pelicula filter change with debounced autocomplete
  const debouncedPeliculaSearch = useCallback(
    debounce(async (query) => {
      if (query.trim() && query.length >= 2) {
        try {
          const sugerencias = await searchPeliculas(query, 5);
          setPeliculasSugeridas(sugerencias);
          setMostrarSugerenciasPeliculas(true);
        } catch (error) {
          console.error('Error searching películas:', error);
          setPeliculasSugeridas([]);
          setMostrarSugerenciasPeliculas(false);
        }
      } else {
        setPeliculasSugeridas([]);
        setMostrarSugerenciasPeliculas(false);
      }
    }, 300), // 300ms delay
    []
  );

  const handlePeliculaChange = useCallback((valor) => {
    setFiltros(prev => ({ ...prev, pelicula: valor }));
    
    // Trigger debounced search
    debouncedPeliculaSearch(valor);
  }, [debouncedPeliculaSearch]);

  // Handle sala filter change with debounced autocomplete
  const debouncedSalaSearch = useCallback(
    debounce(async (query) => {
      if (query.trim() && query.length >= 2) {
        try {
          const sugerencias = await searchSalas(query, 5);
          setSalasSugeridas(sugerencias);
          setMostrarSugerenciasSalas(true);
        } catch (error) {
          console.error('Error searching salas:', error);
          setSalasSugeridas([]);
          setMostrarSugerenciasSalas(false);
        }
      } else {
        setSalasSugeridas([]);
        setMostrarSugerenciasSalas(false);
      }
    }, 300), // 300ms delay
    []
  );

  const handleSalaChange = useCallback((valor) => {
    setFiltros(prev => ({ ...prev, sala: valor }));
    
    // Trigger debounced search
    debouncedSalaSearch(valor);
  }, [debouncedSalaSearch]);

  // Handle filter input changes (for dates)
  const handleFilterChange = useCallback((campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }, []);

  // Select suggestion handlers
  const seleccionarSugerenciaPelicula = useCallback((pelicula) => {
    setFiltros(prev => ({ ...prev, pelicula: pelicula.nombrePelicula }));
    setPeliculasSugeridas([]);
    setMostrarSugerenciasPeliculas(false);
  }, []);

  const seleccionarSugerenciaSala = useCallback((sala) => {
    setFiltros(prev => ({ ...prev, sala: sala.nombreSala }));
    setSalasSugeridas([]);
    setMostrarSugerenciasSalas(false);
  }, []);

  return {
    // State
    filtros,
    peliculasSugeridas,
    salasSugeridas,
    mostrarSugerenciasPeliculas,
    mostrarSugerenciasSalas,
    
    // Actions
    aplicarFiltros,
    limpiarFiltros,
    handlePeliculaChange,
    handleSalaChange,
    handleFilterChange,
    seleccionarSugerenciaPelicula,
    seleccionarSugerenciaSala,
    
    // Setters for external control
    setMostrarSugerenciasPeliculas,
    setMostrarSugerenciasSalas
  };
};
