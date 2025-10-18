import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { getSalas } from "../../../api/Salas.api";
import { getPeliculas } from "../../../api/Peliculas.api";
import { funcionesSchema } from "../../../validations/FuncionesSchema.js";
import { formatDateTimeForBackend, getCurrentDateTime, formatDateForInput } from "../../shared/utils/dateFormater.js";

export default function FuncionesForm({ onSubmit, funcionToEdit = null, isEditing = false, onCancel }) {
  const [salas, setSalas] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el filtrado
  const [salasFiltradas, setSalasFiltradas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [busquedaSala, setBusquedaSala] = useState('');
  const [busquedaPelicula, setBusquedaPelicula] = useState('');
  const [mostrarSugerenciasSalas, setMostrarSugerenciasSalas] = useState(false);
  const [mostrarSugerenciasPeliculas, setMostrarSugerenciasPeliculas] = useState(false);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (funcionToEdit) {
      const sala = salas.find(s => s.idSala === funcionToEdit.idSala);
      const pelicula = peliculas.find(p => p.idPelicula === funcionToEdit.idPelicula);
      setSalaSeleccionada(sala);
      setPeliculaSeleccionada(pelicula);
      setBusquedaSala(sala?.nombreSala || '');
      setBusquedaPelicula(pelicula?.nombrePelicula || '');
    }
  }, [funcionToEdit, salas, peliculas]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salasData, peliculasData] = await Promise.all([
        getSalas(),
        getPeliculas()
      ]);
      setSalas(salasData);
      setPeliculas(peliculasData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalaSearch = (value) => {
    setBusquedaSala(value);
    if (!value.trim()) {
      setSalasFiltradas([]);
      return;
    }
    const filtradas = salas.filter(sala => 
      sala.nombreSala.toLowerCase().includes(value.toLowerCase()) ||
      sala.ubicacion.toLowerCase().includes(value.toLowerCase())
    );
    setSalasFiltradas(filtradas);
    setMostrarSugerenciasSalas(true);
  };

  const handlePeliculaSearch = (value) => {
    setBusquedaPelicula(value);
    if (!value.trim()) {
      setPeliculasFiltradas([]);
      return;
    }
    const filtradas = peliculas.filter(pelicula => 
      pelicula.nombrePelicula.toLowerCase().includes(value.toLowerCase())
    );
    setPeliculasFiltradas(filtradas);
    setMostrarSugerenciasPeliculas(true);
  };

  const seleccionarSala = (sala, setFieldValue) => {
    setSalaSeleccionada(sala);
    setBusquedaSala(sala.nombreSala);
    setFieldValue('idSala', sala.idSala);
    setMostrarSugerenciasSalas(false);
  };

  const seleccionarPelicula = (pelicula, setFieldValue) => {
    setPeliculaSeleccionada(pelicula);
    setBusquedaPelicula(pelicula.nombrePelicula);
    setFieldValue('idPelicula', pelicula.idPelicula);
    setMostrarSugerenciasPeliculas(false);
  };

  // --- MODAL OVERLAY Y CONTENIDO ---
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative bg-slate-800 border border-slate-700 p-4 md:p-6 rounded-lg shadow-lg z-10">
          <div className="text-center text-white">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative bg-slate-800 border border-slate-700 p-4 md:p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg z-10 w-full max-w-lg mx-4">
        <h2 className="text-2xl text-white font-bold mb-4">
          {isEditing ? 'Editar Función' : 'Agregar Nueva Función'}
        </h2>
        
        <Formik
          initialValues={{ 
            idSala: funcionToEdit?.idSala || '',
            idPelicula: funcionToEdit?.idPelicula || '',
            fechaHoraFuncion: isEditing ? formatDateForInput(funcionToEdit?.fechaHoraFuncion) : getCurrentDateTime(),
          }}
          validationSchema={funcionesSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            const fechaHoraFormateada = formatDateTimeForBackend(values.fechaHoraFuncion);          
            const valuesFormatted = {
              ...values,
              fechaHoraFuncion: fechaHoraFormateada
            };
            
            onSubmit(valuesFormatted); 
            
            if (!isEditing) {
              resetForm();
              setBusquedaSala('');
              setBusquedaPelicula('');
              setSalaSeleccionada(null);
              setPeliculaSeleccionada(null);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Sala */}
                <div className="relative">
                  <Label htmlFor="sala" value="Sala *" className="text-white" />
                  <TextInput
                    type="text"
                    value={busquedaSala}
                    onChange={(e) => handleSalaSearch(e.target.value)}
                    placeholder="Buscar sala..."
                    color
                    className="bg-slate-700 text-white border-slate-600 rounded-lg placeholder-gray-400"
                    onBlur={() => setTimeout(() => setMostrarSugerenciasSalas(false), 200)}
                    onFocus={() => handleSalaSearch(busquedaSala)}
                  />
                  <ErrorMessage name="idSala" component="span" className="text-red-500 text-sm" />
                  
                  {mostrarSugerenciasSalas && salasFiltradas.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg">
                      {salasFiltradas.map((sala) => (
                        <div
                          key={sala.idSala}
                          className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white"
                          onClick={() => seleccionarSala(sala, setFieldValue)}
                        >
                          Sala {sala.nombreSala} - {sala.ubicacion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Película */}
                <div className="relative">
                  <Label htmlFor="pelicula" value="Película *" className="text-white" />
                  <TextInput
                    type="text"
                    value={busquedaPelicula}
                    onChange={(e) => handlePeliculaSearch(e.target.value)}
                    placeholder="Buscar película..."
                    color
                    className="bg-slate-700 text-white border-slate-600 rounded-lg placeholder-gray-400"
                    onBlur={() => setTimeout(() => setMostrarSugerenciasPeliculas(false), 200)}
                    onFocus={() => handlePeliculaSearch(busquedaPelicula)}
                  />
                  <ErrorMessage name="idPelicula" component="span" className="text-red-500 text-sm" />
                  
                  {mostrarSugerenciasPeliculas && peliculasFiltradas.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg">
                      {peliculasFiltradas.map((pelicula) => (
                        <div
                          key={pelicula.idPelicula}
                          className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white"
                          onClick={() => seleccionarPelicula(pelicula, setFieldValue)}
                        >
                          {pelicula.nombrePelicula} ({pelicula.duracion} min)
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fecha y Hora */}
                <div>
                  <Label htmlFor="fechaHoraFuncion" value="Fecha y Hora de la Función *" className="text-white" />
                  <Field
                    name="fechaHoraFuncion"
                    type="datetime-local"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                  />
                  <ErrorMessage name="fechaHoraFuncion" component="span" className="text-red-500 text-sm" />
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    color
                    className="!bg-slate-700 hover:!bg-slate-600 text-white" 
                    onClick={() => isEditing && onCancel ? onCancel() : window.location.reload()}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="!bg-gradient-to-r from-purple-600 to-blue-600 hover:!from-purple-700 hover:!to-blue-700 text-white"
                  >
                    {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Función" : "Guardar Función"}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
export { FuncionesForm };