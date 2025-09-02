import { getFunciones, deleteFuncion, updateFuncion } from "../api/Funciones.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
} from "flowbite-react";
import { useEffect, useState } from "react";
import formatearFecha from "../utils/formatearFecha";
import ModalDeleteFuncion from "./ModalDeleteFuncion";
import ModalPublishFuncion from "./ModalPublishFuncion";

function FuncionesList() {
  const [funciones, setFunciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [funcionToDelete, setFuncionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModalPublish, setShowModalPublish] = useState(false);
  const [funcionToPublish, setFuncionToPublish] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchFunciones();
  }, []);

 const fetchFunciones = async () => {
  try {
    setLoading(true);
    const funcionesData = await getFunciones();
    setFunciones(funcionesData);
    setError(null);
  } catch (error) {
    console.error("Error fetching funciones:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  // Función para formatear fecha y hora
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { fecha: 'Sin fecha', hora: 'Sin hora' };
    
    // Usar la misma lógica que formatearFecha para evitar problemas de zona horaria
    const [fechaParte, horaParte] = dateTimeString.split('T');
    const [year, month, day] = fechaParte.split('-');
    const [hours, minutes] = horaParte.substring(0, 5).split(':'); // Solo tomar HH:mm
    
    // Crear fecha local sin conversión automática
    const fechaLocal = new Date(year, month - 1, day, hours, minutes);
    
    if (isNaN(fechaLocal.getTime())) {
      return { fecha: 'Fecha inválida', hora: 'Hora inválida' };
    }
    
    return {
      fecha: formatearFecha(dateTimeString), // Usar el formateador existente
      hora: `${hours}:${minutes}` // Mostrar hora tal como viene
    };
  };
  const handlePublishFuncion = async () => {
    if (!funcionToPublish) return;
    setIsPublishing(true);
    try {
      // Determinar el nuevo estado basado en el estado actual
      const nuevoEstado = funcionToPublish.estado === 'Privada' ? 'Publica' : 'Privada';
      
      // Crear el objeto de actualización con solo el campo que necesita cambiar
      const funcionActualizada = {
        ...funcionToPublish,
        estado: nuevoEstado
      };
      
      // Actualizar en el backend usando los parámetros separados
      const idSala = funcionToPublish.idSala;
      const fechaHoraFuncion = funcionToPublish.fechaHoraFuncion;
      
      console.log('Actualizando función con:', { idSala, fechaHoraFuncion, nuevoEstado });
      console.log('Función original:', funcionToPublish);
      console.log('Función actualizada:', funcionActualizada);
      
      await updateFuncion(idSala, fechaHoraFuncion, funcionActualizada);
      
      // Refrescar la lista
      await fetchFunciones();
      
      // Cerrar modal
      setShowModalPublish(false);
      setFuncionToPublish(null);
      
    } catch (error) {
      console.error('Error cambiando estado de función:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      alert(`Error cambiando estado de función: ${errorMessage}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Handler para eliminar función
  const handleDeleteFuncion = async () => {
    if (!funcionToDelete) return;
    setIsDeleting(true);
    try {
      // Extraer los parámetros necesarios para el endpoint
      const idSala = funcionToDelete.idSala;
      const fechaHoraFuncion = funcionToDelete.fechaHoraFuncion;
      
      console.log('Eliminando función con:', { idSala, fechaHoraFuncion });
      
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
                  No hay funciones registradas
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
                        <span>Sala {funcion.sala?.idSala} - {funcion.sala?.ubicacion || 'Sin ubicación'}</span>
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
                        <Button 
                          size="sm" 
                          className={`w-full sm:w-auto text-sm ${
                            funcion.estado === 'Privada' 
                              ? 'bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600' 
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => funcion.estado === 'Privada' ? console.log('Editar función:', funcion) : null}
                          disabled={funcion.estado !== 'Privada'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          className={`w-full sm:w-auto text-sm ${
                            funcion.estado === 'Privada' 
                              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => funcion.estado === 'Privada' ? (() => {
                            setFuncionToDelete(funcion);
                            setShowDeleteModal(true);
                          })() : null}
                          disabled={funcion.estado !== 'Privada'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* view para mobile */}
      <div className="md:hidden space-y-4">
        {funciones.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No hay funciones registradas
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
                        {funcion.nombrePelicula || 'Sin película'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Sala {funcion.idSala} - {funcion.ubicacion || 'Sin ubicación'}
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
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <span>{hora}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <span>Duración: {funcion.duracion} minutos</span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className={`w-full text-sm ${
                      funcion.estado === 'Privada' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                    }`}
                    onClick={() => {
                      setFuncionToPublish(funcion);
                      setShowModalPublish(true);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mr-2">
                      {funcion.estado === 'Privada' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
                      )}
                    </svg>
                    {funcion.estado === 'Privada' ? 'Publicar Función' : 'Privatizar Función'}
                  </Button>                  
                  <Button 
                    size="sm" 
                    className={`w-full text-sm ${
                      funcion.estado === 'Privada' 
                        ? 'bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => funcion.estado === 'Privada' ? console.log('Editar función:', funcion) : null}
                    disabled={funcion.estado !== 'Privada'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l .8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Editar Función
                  </Button>
                  <Button 
                    size="sm" 
                    className={`w-full text-sm ${
                      funcion.estado === 'Privada' 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => funcion.estado === 'Privada' ? (() => {
                      setFuncionToDelete(funcion);
                      setShowDeleteModal(true);
                    })() : null}
                    disabled={funcion.estado !== 'Privada'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Eliminar Función
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal para eliminar función */}
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

      {/* Modal para publicar/privatizar función */}
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
    </div>
  );
}

export default FuncionesList;