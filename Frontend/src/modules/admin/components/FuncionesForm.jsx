import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, TextInput } from 'flowbite-react';
import { useState, useEffect, useCallback } from 'react';
import { FormSkeleton } from '../../shared/components/Skeleton';
import { searchSalas } from '../../../api/Salas.api';
import { searchPeliculas } from '../../../api/Peliculas.api';
import { funcionesSchema } from '../../../validations/FuncionesSchema.js';
import {
  formatDateTimeForBackend,
  getCurrentDateTime,
  formatDateForInput,
} from '../../../utils/dateFormater.js';
import { debounce } from '../../../utils/debounce.js';

export default function FuncionesForm({
  onSubmit,
  funcionToEdit = null,
  isEditing = false,
  onCancel,
}) {
  const [loading, setLoading] = useState(false);

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
    if (funcionToEdit) {
      // Set initial search values from funcionToEdit if editing
      setBusquedaSala(funcionToEdit.sala?.nombreSala || '');
      setBusquedaPelicula(funcionToEdit.pelicula?.nombrePelicula || '');
      setSalaSeleccionada(funcionToEdit.sala || null);
      setPeliculaSeleccionada(funcionToEdit.pelicula || null);
    }
  }, [funcionToEdit]);

  // Búsqueda de salas con debounce
  const debouncedSalaSearch = useCallback(
    debounce(async (value) => {
      if (!value.trim()) {
        setSalasFiltradas([]);
        return;
      }
      try {
        const filtradas = await searchSalas(value, 10);
        setSalasFiltradas(filtradas);
        setMostrarSugerenciasSalas(true);
      } catch (error) {
        setSalasFiltradas([]);
      }
    }, 300),
    []
  );

  const handleSalaSearch = (value) => {
    setBusquedaSala(value);
    debouncedSalaSearch(value);
  };

  // Búsqueda de películas con debounce
  const debouncedPeliculaSearch = useCallback(
    debounce(async (value) => {
      if (!value.trim()) {
        setPeliculasFiltradas([]);
        return;
      }
      try {
        const filtradas = await searchPeliculas(value, 10);
        setPeliculasFiltradas(filtradas);
        setMostrarSugerenciasPeliculas(true);
      } catch (error) {
        setPeliculasFiltradas([]);
      }
    }, 300),
    []
  );

  const handlePeliculaSearch = (value) => {
    setBusquedaPelicula(value);
    debouncedPeliculaSearch(value);
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
        <div className="relative bg-slate-800 border border-slate-700 p-4 md:p-6 rounded-lg shadow-lg z-10 w-full max-w-lg mx-4">
          <Skeleton height="h-8" width="w-48" rounded="rounded" className="mb-4" />
          <FormSkeleton fields={3} hasButton />
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
            fechaHoraFuncion: isEditing
              ? formatDateForInput(funcionToEdit?.fechaHoraFuncion)
              : getCurrentDateTime(),
          }}
          validationSchema={funcionesSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            const fechaHoraFormateada = formatDateTimeForBackend(values.fechaHoraFuncion);
            const valuesFormatted = {
              ...values,
              fechaHoraFuncion: fechaHoraFormateada,
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
                  <label className="block text-white font-medium mb-2" htmlFor="search-sala">
                    Sala *
                  </label>
                  <TextInput
                    id="search-sala"
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
                  <label className="block text-white font-medium mb-2" htmlFor="search-pelicula">
                    Película *
                  </label>
                  <TextInput
                    id="search-pelicula"
                    type="text"
                    value={busquedaPelicula}
                    onChange={(e) => handlePeliculaSearch(e.target.value)}
                    placeholder="Buscar película..."
                    color
                    className="bg-slate-700 text-white border-slate-600 rounded-lg placeholder-gray-400"
                    onBlur={() => setTimeout(() => setMostrarSugerenciasPeliculas(false), 200)}
                    onFocus={() => handlePeliculaSearch(busquedaPelicula)}
                  />
                  <ErrorMessage
                    name="idPelicula"
                    component="span"
                    className="text-red-500 text-sm"
                  />

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
                  <label className="block text-white font-medium mb-2" htmlFor="fechaHoraFuncion">
                    Fecha y Hora de la Función *
                  </label>
                  <Field
                    id="fechaHoraFuncion"
                    name="fechaHoraFuncion"
                    type="datetime-local"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                  />
                  <ErrorMessage
                    name="fechaHoraFuncion"
                    component="span"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    color
                    className="!bg-slate-700 hover:!bg-slate-600 text-white"
                    onClick={onCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="!bg-gradient-to-r from-purple-600 to-blue-600 hover:!from-purple-700 hover:!to-blue-700 text-white"
                  >
                    {isSubmitting
                      ? 'Guardando...'
                      : isEditing
                        ? 'Actualizar Función'
                        : 'Guardar Función'}
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
