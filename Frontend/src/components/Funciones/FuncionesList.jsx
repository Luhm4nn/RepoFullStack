import { getFuncionesActivas, getFuncionesInactivas, deleteFuncion, updateFuncion } from "../../api/Funciones.api";
import { getPeliculas } from "../../api/Peliculas.api";
import { getSalas } from "../../api/Salas.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Modal,
  ModalBody,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../utils/dateFormater";
import ModalDeleteFuncion from "./ModalDeleteFuncion";
import ModalPublishFuncion from "./ModalPublishFuncion";
import FuncionesForm from "./FuncionesForm";
import ErrorModal from "../Shared/ErrorModal";
import { useErrorModal } from "../../hooks/useErrorModal";

function FuncionesList() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [mostrandoActivas, setMostrandoActivas] = useState(true);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [funcionToDelete, setFuncionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [showModalPublish, setShowModalPublish] = useState(false);
  const [funcionToPublish, setFuncionToPublish] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [funcionToEdit, setFuncionToEdit] = useState(null);
  
  // Inline filter states
  const [funcionesSinFiltrar, setFuncionesSinFiltrar] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
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
  
  const { error: modalError, handleApiError, hideError } = useErrorModal();

  useEffect(() => {
    fetchFunciones();
    loadPeliculasYSalas();
  }, [mostrandoActivas]); //Refresh when filter changes

  const loadPeliculasYSalas = async () => {
    try {
      const [peliculasData, salasData] = await Promise.all([
        getPeliculas(),
        getSalas()
      ]);
      setPeliculas(peliculasData);
      setSalas(salasData);
    } catch (error) {
      console.error('Error loading movies and rooms:', error);
    }
  };

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

  // Handler to publish/unpublish function
  const handlePublishFuncion = async () => {
    if (!funcionToPublish) return;
    setIsPublishing(true);
    try {
      // Determine new state based on current state
      const nuevoEstado = funcionToPublish.estado === 'Privada' ? 'Publica' : 'Privada';
      const funcionActualizada = {
        ...funcionToPublish,
        estado: nuevoEstado
      };
      const idSala = funcionToPublish.idSala;
      const fechaHoraFuncion = funcionToPublish.fechaHoraFuncion;
      
      await updateFuncion(idSala, fechaHoraFuncion, funcionActualizada);
      
      await fetchFunciones();
      
      setShowModalPublish(false);
      setFuncionToPublish(null);
      
    } catch (error) {
      console.error('Error publicando función:', error);
      const wasHandled = handleApiError(error);
      if (!wasHandled) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        alert(`Error publicando función: ${errorMessage}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Handler to delete function
  const handleDeleteFuncion = async () => {
    if (!funcionToDelete) return;
    setIsDeleting(true);
    try {
      const idSala = funcionToDelete.idSala;
      const fechaHoraFuncion = funcionToDelete.fechaHoraFuncion;

      await deleteFuncion(idSala, fechaHoraFuncion);
      await fetchFunciones();
      setShowDeleteModal(false);
      setFuncionToDelete(null);
    } catch (error) {
      console.error('Error eliminando función:', error);
      alert('Error eliminando función');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditFuncion = (funcion) => {
    setFuncionToEdit(funcion);
    setShowEditModal(true);
  };

  // Handler for edit form submission
  const handleEditSubmit = async (funcionActualizada) => {
    if (!funcionToEdit) return;
    
    try {
      const idSalaOriginal = funcionToEdit.idSala;
      const fechaHoraOriginal = funcionToEdit.fechaHoraFuncion;
      
      await updateFuncion(idSalaOriginal, fechaHoraOriginal, funcionActualizada);
      await fetchFunciones();
      setShowEditModal(false);
      setFuncionToEdit(null);
    } catch (error) {
      console.error('Error actualizando función:', error);
      const wasHandled = handleApiError(error);
      if (!wasHandled) {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        alert(`Error actualizando función: ${errorMessage}`);
      }
    }
  };

  // Inline filter functions
  const aplicarFiltros = () => {
    let funcionesFiltradas = [...funcionesSinFiltrar];

    // Filter by pelicula
    if (filtros.pelicula.trim()) {
      const peliculasCoincidentes = peliculas.filter(p => 
        p && p.nombrePelicula && p.nombrePelicula.toLowerCase().includes(filtros.pelicula.toLowerCase())
      );
      if (peliculasCoincidentes.length > 0) {
        const idsPeliculas = peliculasCoincidentes.map(p => p.idPelicula);
        funcionesFiltradas = funcionesFiltradas.filter(
          funcion => idsPeliculas.includes(funcion.idPelicula)
        );
      } else {
        funcionesFiltradas = [];
      }
    }

    // Filter by sala
    if (filtros.sala.trim()) {
      const salasCoincidentes = salas.filter(s => 
        s && s.nombreSala && s.nombreSala.toLowerCase().includes(filtros.sala.toLowerCase())
      );
      if (salasCoincidentes.length > 0) {
        const idsSalas = salasCoincidentes.map(s => s.idSala);
        funcionesFiltradas = funcionesFiltradas.filter(
          funcion => idsSalas.includes(funcion.idSala)
        );
      } else {
        funcionesFiltradas = [];
      }
    }

    // Filter by date from
    if (filtros.fechaDesde) {
      const fechaDesde = new Date(filtros.fechaDesde + 'T00:00:00');
      funcionesFiltradas = funcionesFiltradas.filter(
        funcion => new Date(funcion.fechaHoraFuncion) >= fechaDesde
      );
    }

    // Filter by date to
    if (filtros.fechaHasta) {
      const fechaHasta = new Date(filtros.fechaHasta + 'T23:59:59');
      funcionesFiltradas = funcionesFiltradas.filter(
        funcion => new Date(funcion.fechaHoraFuncion) <= fechaHasta
      );
    }

    setFunciones(funcionesFiltradas);
  };

  const limpiarFiltros = () => {
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
  };

  const handlePeliculaChange = (valor) => {
    setFiltros(prev => ({ ...prev, pelicula: valor }));
    
    if (valor.trim() && peliculas.length > 0) {
      const sugerencias = peliculas.filter(p => 
        p && p.nombrePelicula && p.nombrePelicula.toLowerCase().includes(valor.toLowerCase())
      ).slice(0, 5);
      setPeliculasSugeridas(sugerencias);
      setMostrarSugerenciasPeliculas(true);
    } else {
      setPeliculasSugeridas([]);
      setMostrarSugerenciasPeliculas(false);
    }
  };

  const handleSalaChange = (valor) => {
    setFiltros(prev => ({ ...prev, sala: valor }));
    
    if (valor.trim() && salas.length > 0) {
      const sugerencias = salas.filter(s => 
        s && s.nombreSala && s.nombreSala.toLowerCase().includes(valor.toLowerCase())
      ).slice(0, 5);
      setSalasSugeridas(sugerencias);
      setMostrarSugerenciasSalas(true);
    } else {
      setSalasSugeridas([]);
      setMostrarSugerenciasSalas(false);
    }
  };

  const seleccionarPelicula = (pelicula) => {
    if (pelicula && pelicula.nombrePelicula) {
      setFiltros(prev => ({ ...prev, pelicula: pelicula.nombrePelicula }));
      setMostrarSugerenciasPeliculas(false);
      setPeliculasSugeridas([]);
    }
  };

  const seleccionarSala = (sala) => {
    if (sala && sala.nombreSala) {
      setFiltros(prev => ({ ...prev, sala: sala.nombreSala }));
      setMostrarSugerenciasSalas(false);
      setSalasSugeridas([]);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    if (funcionesSinFiltrar.length > 0) {
      aplicarFiltros();
    }
  }, [filtros, funcionesSinFiltrar]);

  if (loading) {
    return <div className="text-center p-4">Cargando Funciones...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-white text-xl">No se encontraron Funciones cargadas.</p>
        <button 
          onClick={fetchFunciones} 
          className="mt-2 px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-700 text-white rounded transition-colors text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold text-white">
          {mostrandoActivas ? 'Funciones Activas' : 'Funciones Finalizadas'}
        </h2>
        <Button
          onClick={() => setMostrandoActivas(!mostrandoActivas)}
          className={`text-sm ${
            mostrandoActivas 
              ? '!bg-slate-600 hover:!bg-slate-700' 
              : '!bg-orange-600 hover:!bg-orange-700'
          }`}
        >
          {mostrandoActivas 
            ? ' Ver Finalizadas' 
            : ' Ver Activas'
          }
        </Button>
      </div>

      {/* Inline filters */}
      <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Pelicula filter */}
          <div className="relative">
            <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
              </svg>
              Película
            </label>
            <div className="relative">
              <TextInput
                type="text"
                placeholder="Buscar película..."
                value={filtros.pelicula}
                onChange={(e) => handlePeliculaChange(e.target.value)}
                className="pr-8"
                onBlur={() => {
                  setTimeout(() => setMostrarSugerenciasPeliculas(false), 200);
                }}
                onFocus={() => {
                  if (peliculasSugeridas.length > 0) {
                    setMostrarSugerenciasPeliculas(true);
                  }
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {mostrarSugerenciasPeliculas && peliculasSugeridas.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-md mt-1 z-50 shadow-lg">
                  {peliculasSugeridas.map((pelicula) => (
                    <div
                      key={pelicula.idPelicula}
                      className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-white text-sm"
                      onClick={() => seleccionarPelicula(pelicula)}
                    >
                      {pelicula.nombrePelicula}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sala filter */}
          <div className="relative">
            <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              Sala
            </label>
            <div className="relative">
              <TextInput
                type="text"
                placeholder="Buscar sala..."
                value={filtros.sala}
                onChange={(e) => handleSalaChange(e.target.value)}
                className="pr-8"
                onBlur={() => {
                  setTimeout(() => setMostrarSugerenciasSalas(false), 200);
                }}
                onFocus={() => {
                  if (salasSugeridas.length > 0) {
                    setMostrarSugerenciasSalas(true);
                  }
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {mostrarSugerenciasSalas && salasSugeridas.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-md mt-1 z-50 shadow-lg">
                  {salasSugeridas.map((sala) => (
                    <div
                      key={sala.idSala}
                      className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-white text-sm"
                      onClick={() => seleccionarSala(sala)}
                    >
                      {sala.nombreSala}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date from */}
          <div>
            <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Desde
            </label>
            <TextInput
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
            />
          </div>

          {/* Date to */}
          <div>
            <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Hasta
            </label>
            <TextInput
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
            />
          </div>

          {/* Clear button */}
          <div className="flex items-end">
            <Button
              onClick={limpiarFiltros}
              className="w-full !bg-slate-500 hover:!bg-slate-600 text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Limpiar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="hidden md:block overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow className="bg-slate-800/50 text-white pointer-events-none border-slate-700">
              <TableHeadCell className="bg-slate-800/50 text-white">Película</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Sala</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Fecha</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Hora</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Estado</TableHeadCell>
              <TableHeadCell className="bg-slate-800/50 text-white">Acciones</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {funciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  {mostrandoActivas 
                    ? 'No hay funciones activas registradas' 
                    : 'No hay funciones finalizadas'
                  }
                </TableCell>
              </TableRow>
            ) : (
              funciones.map(funcion => {
                const { fecha, hora } = formatDateTime(funcion.fechaHoraFuncion);
                return (
                  <TableRow key={`${funcion.idSala}-${funcion.fechaHoraFuncion}`} className="bg-slate-800/50 hover:bg-white/10 text-gray-300 border-slate-700">
                    <TableCell className="whitespace-nowrap font-medium text-white">
                      {funcion.pelicula?.nombrePelicula || 'Sin película'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3Z" />
                        </svg>
                        <span>{funcion.sala?.nombreSala} - {funcion.sala?.ubicacion || 'Sin ubicación'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{fecha}</TableCell>
                    <TableCell>{hora}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${funcion.estado === 'Privada' ? 'text-red-500' : funcion.estado === 'Publica' ? 'text-green-500' : ''}`}>{funcion.estado}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {funcion.estado !== 'Inactiva' && (
                          <Button 
                            size="sm" 
                            className={`w-full sm:w-auto text-sm ${
                              funcion.estado === 'Privada'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                            }`}
                            onClick={() => {
                              setFuncionToPublish(funcion);
                              setShowModalPublish(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                              {funcion.estado === 'Privada' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
                              )}
                            </svg>
                            {funcion.estado === 'Privada' ? 'Publicar' : 'Privatizar'}
                          </Button>
                        )}
                        
                        {funcion.estado === 'Privada' && (
                          <Button 
                            size="sm" 
                            className="w-full sm:w-auto text-sm bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600"
                            onClick={() => handleEditFuncion(funcion)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Editar
                          </Button>
                        )}

                        {(funcion.estado === 'Privada' || funcion.estado === 'Inactiva') && (
                          <Button 
                            size="sm" 
                            className="w-full sm:w-auto text-sm bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                            onClick={() => {
                              setFuncionToDelete(funcion);
                              setShowDeleteModal(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {funciones.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {mostrandoActivas 
              ? 'No hay funciones activas registradas' 
              : 'No hay funciones finalizadas'
            }
          </div>
        ) : (
          funciones.map((funcion) => {
            const { fecha, hora } = formatDateTime(funcion.fechaHoraFuncion);
            return (
              <div key={`${funcion.idSala}-${funcion.fechaHoraFuncion}`} className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 space-y-3">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">
                        {funcion.pelicula?.nombrePelicula || 'Sin película'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {funcion.sala?.nombreSala} - {funcion.sala?.ubicacion || 'Sin ubicación'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                    </div>
                    <span>{fecha}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <span>{hora}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  </div>
                  <span className={`font-bold ${funcion.estado === 'Privada' ? 'text-red-500' : funcion.estado === 'Publica' ? 'text-green-500' : funcion.estado === 'Inactiva' ? 'text-gray-500' : ''}`}>{funcion.estado}</span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  {funcion.estado !== 'Inactiva' && (
                    <Button 
                      size="sm" 
                      className={`w-full text-sm ${
                        funcion.estado === 'Privada' 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                      }`}
                      onClick={() => {
                        setFuncionToPublish(funcion);
                        setShowModalPublish(true);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2 text-white">
                        {funcion.estado === 'Privada' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
                        )}
                      </svg>
                      {funcion.estado === 'Privada' ? 'Publicar' : 'Privatizar'}
                    </Button>
                  )}
                  
                  {funcion.estado === 'Privada' && (
                    <Button 
                      size="sm" 
                      className="w-full text-sm bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600"
                      onClick={() => handleEditFuncion(funcion)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l .8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Editar
                    </Button>
                  )}

                  {(funcion.estado === 'Privada' || funcion.estado === 'Inactiva') && (
                    <Button 
                      size="sm" 
                      className="w-full text-sm bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      onClick={() => {
                        setFuncionToDelete(funcion);
                        setShowDeleteModal(true);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <ModalDeleteFuncion
            funcion={funcionToDelete}
            onConfirm={handleDeleteFuncion}
            onCancel={() => { 
              setShowDeleteModal(false); 
              setFuncionToDelete(null); 
            }}
            isDeleting={isDeleting}
          />
        </div>
      )}

      {/* Publish/unpublish modal */}
      {showModalPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <ModalPublishFuncion
            funcion={funcionToPublish}
            onConfirm={handlePublishFuncion}
            onCancel={() => { 
              setShowModalPublish(false); 
              setFuncionToPublish(null); 
            }}
            isPublishing={isPublishing}
          />
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && (
        <Modal show={showEditModal} onClose={() => {
          setShowEditModal(false);
          setFuncionToEdit(null);
        }} size="xl"
        theme={{
          content: {
            base: "relative h-full w-full p-4 flex items-center justify-center min-h-screen",
            inner: "relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
          }
        }}>
          <ModalBody className="p-0">
            <FuncionesForm 
              onSubmit={handleEditSubmit}
              funcionToEdit={funcionToEdit}
              isEditing={true}
              onCancel={() => {
                setShowEditModal(false);
                setFuncionToEdit(null);
              }}
            />
          </ModalBody>
        </Modal>
      )}

      {/* Error modal */}
      <ErrorModal error={modalError} onClose={hideError} />
    </div>
  );
}

export default FuncionesList;