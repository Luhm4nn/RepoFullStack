import { useState, useEffect } from "react";
import { Button, TextInput, Select, Textarea } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createPelicula, updatePelicula } from "../api/Peliculas.api";
import peliculaSchema from "../validations/PeliculasSchema.js";
import { formatToISO8601 } from "../utils/dateFormater.js";
import FormDatePicker from "./FormDatePicker";


function ModalPeliculas({ onSuccess, peliculaToEdit = null, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const isEditing = !!peliculaToEdit;

  // Abre el modal automáticamente si hay una película para editar
  useEffect(() => {
    if (peliculaToEdit) {
      setShowModal(true);
    }
  }, [peliculaToEdit]);

  const handleClose = () => {
    setShowModal(false);
    if (onClose) {
      onClose();
    }
  };
  const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split('T')[0]; // YYYY-MM-DD para el input
};

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      console.log(isEditing ? 'Editando película:' : 'Creando película:', values);
      
      // Limpiar datos antes de enviar
      const cleanData = {
        ...values,
        duracion: parseInt(values.duracion),
        fechaEstreno: formatToISO8601(values.fechaEstreno) || null,
        sinopsis: values.sinopsis || null,
        trailerURL: values.trailerURL || null,
        portada: values.portada || null,
        MPAA: values.MPAA || null
      };
      
      if (isEditing) {
        await updatePelicula(peliculaToEdit.idPelicula, cleanData);
        console.log('Película actualizada exitosamente');
      } else {
        await createPelicula(cleanData);
        console.log('Película creada exitosamente');
      }
      
      handleClose();
      resetForm();
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error(`Error ${isEditing ? 'actualizando' : 'creando'} película:`, error);
      alert(`Error al ${isEditing ? 'actualizar' : 'crear'} película: ` + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  // initial values for the form
  const initialValues = isEditing ? {
    nombrePelicula: peliculaToEdit.nombrePelicula || "",
    duracion: peliculaToEdit.duracion?.toString() || "",
    generoPelicula: peliculaToEdit.generoPelicula || "",
    director: peliculaToEdit.director || "",
    fechaEstreno: formatDateForInput(peliculaToEdit.fechaEstreno),
    sinopsis: peliculaToEdit.sinopsis || "",
    trailerURL: peliculaToEdit.trailerURL || "",
    portada: peliculaToEdit.portada || "",
    MPAA: peliculaToEdit.MPAA || "",
  } : {
    nombrePelicula: "",
    duracion: "",
    generoPelicula: "",
    director: "",
    fechaEstreno: "",
    sinopsis: "",
    trailerURL: "",
    portada: "",
    MPAA: "",
  };

  return (
    <>
      {!isEditing && (
        <Button 
          onClick={() => setShowModal(true)}
          className="!bg-gradient-to-r from-purple-700 to-blue-700 hover:!from-purple-600 hover:!to-blue-600 text-white"
        >
          ➕ Añadir Película
        </Button>
      )}

      {/* Modal with blurred background */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred background */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleClose}
          />

          {/* Centered content */}
          <div className="relative bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* SSimple header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? "✏️ Editar Película" : "🎬 Añadir Nueva Película"}
              </h2>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={peliculaSchema}
              enableReinitialize={true} 
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Grid with main fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Título de la Película *
                      </label>
                      <Field
                        as={TextInput}
                        name="nombrePelicula"
                        placeholder="Ej: Avengers: Endgame, El Padrino, Titanic"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="nombrePelicula" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Director de la Película *
                      </label>
                      <Field
                        as={TextInput}
                        name="director"
                        placeholder="Ej: Christopher Nolan, Steven Spielberg"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="director" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Género Cinematográfico *
                      </label>
                      <Field as={Select} name="generoPelicula" disabled={isSubmitting}>
                        <option value="">Selecciona el género principal</option>
                        <option value="Accion">Acción</option>
                        <option value="Drama">Drama</option>
                        <option value="Comedia">Comedia</option>
                        <option value="Terror">Terror</option>
                        <option value="Ciencia Ficcion">Ciencia Ficción</option>
                        <option value="Romance">Romance</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Aventura">Aventura</option>
                        <option value="Animacion">Animación</option>
                        <option value="Documental">Documental</option>
                      </Field>
                      <ErrorMessage name="generoPelicula" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Duración en Minutos *
                      </label>
                      <Field
                        as={TextInput}
                        name="duracion"
                        type="number"
                        placeholder="Ej: 120 (2 horas), 90 (1.5 horas)"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="duracion" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Fecha de Estreno
                      </label>
                      <FormDatePicker
                        name="fechaEstreno"
                        placeholder="Selecciona la fecha de estreno"
                        disabled={isSubmitting}
                      />
        
                      <ErrorMessage name="fechaEstreno" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Clasificación por Edad (MPAA)
                      </label>
                      <Field as={Select} name="MPAA" disabled={isSubmitting}>
                        <option value="">Selecciona la clasificación</option>
                        <option value="G">G - Apto para toda la familia</option>
                        <option value="PG">PG - Se recomienda supervisión parental</option>
                        <option value="PG-13">PG-13 - Mayores de 13 años</option>
                        <option value="R">R - Restringida (menores acompañados)</option>
                        <option value="NC-17">NC-17 - Solo para adultos (+18)</option>
                      </Field>
                      <ErrorMessage name="MPAA" component="div" className="text-red-400 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Sinopsis */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Sinopsis / Descripción de la Película
                    </label>
                    <Field
                      as={Textarea}
                      name="sinopsis"
                      placeholder="Ej: Un épico relato de superhéroes que enfrentan su mayor amenaza. Los Avengers deben reunirse una vez más para salvar el universo de la destrucción total..."
                      rows={4}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="sinopsis" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  {/* URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        URL del Trailer (YouTube)
                      </label>
                      <Field
                        as={TextInput}
                        name="trailerURL"
                        placeholder="Ej: https://youtube.com/watch?v=TcMBFSGVi1c"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="trailerURL" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        URL del Póster / Imagen
                      </label>
                      <Field
                        as={TextInput}
                        name="portada"
                        placeholder="Ej: https://image.tmdb.org/t/p/w500/poster.jpg"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="portada" component="div" className="text-red-400 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6 justify-center border-t border-gray-600">
                    <Button 
                      type="button" 
                      color="gray" 
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-8"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="!bg-gradient-to-r from-purple-600 to-blue-600 hover:!from-purple-700 hover:!to-blue-700 px-8"
                    >
                      {isSubmitting ? "Guardando..." : (isEditing ? "Actualizar Película" : "Crear Película")}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalPeliculas;