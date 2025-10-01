import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Label, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { getSalas } from "../../../api/Salas.api";
import { getPeliculas } from "../../../api/Peliculas.api";
import { funcionesSchema } from "../../../validations/FuncionesSchema.js";
import { formatDateTimeForBackend, getCurrentDateTime, formatDateForInput } from "../../shared/utils/dateFormater.js";

export default function FuncionesForm({ onSubmit, funcionToEdit = null, isEditing = false, onCancel }) {
  const [salas, setSalas] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="bg-slate-800 border-slate-700 p-4 md:p-6 rounded-lg shadow-lg">
        <div className="text-center text-white">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border-slate-700 p-4 md:p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg">
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
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
            
            {/* Sala */}
              <div>
                <Label htmlFor="idSala" value="Sala *" />
                <Field as={Select} name="idSala" className="bg-slate-700 hover:bg-white/10 text-white">
                  <option value="" className="bg-slate-700 border-slate-600 hover:bg-white/10 text-white">Selecciona una sala</option>
                  {salas.map((sala) => (
                    <option 
                      key={sala.idSala} 
                      value={sala.idSala} 
                      className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white"
                    >
                      Sala {sala.idSala} - {sala.ubicacion} ({sala.filas * sala.asientosPorFila} asientos)
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="idSala" component="span" className="text-red-500 text-sm" />
              </div>

            {/* Película */}
              <div>
                <Label htmlFor="idPelicula" value="Película *" />
                <Field as={Select} name="idPelicula" className="bg-slate-700 hover:bg-white/10 text-white">
                  <option value="" className="bg-slate-700 border-slate-600 hover:bg-white/10 text-white">Selecciona una película</option>
                  {peliculas.map((pelicula) => (
                    <option 
                      key={pelicula.idPelicula} 
                      value={pelicula.idPelicula} 
                      className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white"
                    >
                      {pelicula.nombrePelicula} ({pelicula.duracion} min)
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="idPelicula" component="span" className="text-red-500 text-sm" />
              </div>

              {/* Fecha y Hora */}
              <div>
                <Label htmlFor="fechaHoraFuncion" value="Fecha y Hora de la Función *" />
                <Field
                  name="fechaHoraFuncion"
                  type="datetime-local"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-white/10"
                />
                <ErrorMessage name="fechaHoraFuncion" component="span" className="text-red-500 text-sm" />
              </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4">
              <Button 
                type="button" 
                color 
                className="text-white bg-slate-700 hover:bg-white/10" 
                onClick={() => isEditing && onCancel ? onCancel() : window.location.reload()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} color className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Función" : "Guardar Función"}
              </Button>
            </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export { default as FuncionesForm } from './FuncionesForm.jsx';