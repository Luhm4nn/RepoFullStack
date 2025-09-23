import { useState, useEffect } from "react";
import { Button, TextInput, Select, Textarea } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createPelicula, updatePelicula } from "../../../api/Peliculas.api";
import peliculaSchema from "../validations/PeliculasSchema.js";
import { dateFormaterBackend } from "../../shared/utils/dateFormater.js";
import useErrorModal from "../../shared/hooks/useErrorModal";
import ErrorModal from "../../shared/components/ErrorModal.jsx";

function ModalPeliculas({ onSuccess, peliculaToEdit = null, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { error, handleApiError, hideError } = useErrorModal();
  const isEditing = !!peliculaToEdit;

  // Abre el modal automáticamente si hay una película para editar
  useEffect(() => {
    if (peliculaToEdit) {
      setShowModal(true);
      // Si estamos editando y hay una portada existente, mostrarla como preview
      if (peliculaToEdit.portada) {
        setPreviewUrl(peliculaToEdit.portada);
      }
    }
  }, [peliculaToEdit]);

  const handleClose = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen');
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo debe ser menor a 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Crear preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setSelectedFile(null);
      setPreviewUrl(isEditing && peliculaToEdit.portada ? peliculaToEdit.portada : null);
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // Crear FormData solo con los campos necesarios
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'duracion') {
          formData.append(key, parseInt(values[key]) || 0);
        } else if (key === 'fechaEstreno') {
          const formattedDate = values[key] ? dateFormaterBackend(values[key]) : '';
          formData.append(key, formattedDate);
        } else {
          formData.append(key, values[key] || '');
        }
      });

      // Solo agregar 'portada' si hay archivo nuevo seleccionado
      if (selectedFile) {
        formData.append('portada', selectedFile);
      }

      // Debug opcional
      // console.log('FormData entries:');
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, ':', value);
      // }

      if (isEditing) {
        await updatePelicula(peliculaToEdit.idPelicula, formData);
      } else {
        await createPelicula(formData);
      }

      handleClose();
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Manejo de error
      const handled = handleApiError(error);
      
      // Si no se pudo manejar con el modal, mostrar alert como fallback
      if (!handled) {
        alert(`Error al ${isEditing ? 'actualizar' : 'crear'} película: ` + (error.response?.data?.message || error.message));
      }
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
    MPAA: peliculaToEdit.MPAA || "",
  } : {
    nombrePelicula: "",
    duracion: "",
    generoPelicula: "",
    director: "",
    fechaEstreno: "",
    sinopsis: "",
    trailerURL: "",
    MPAA: "",
  };

  return (
    <>
      {!isEditing && (
        <Button 
          onClick={() => setShowModal(true)}
               className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2.5" 
              stroke="currentColor" 
              className="size-4.5 mr-2.25"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Añadir Película
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
            {/* Simple header */}
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
                        <option value=""> Selecciona el género principal</option>
                        <option value="Accion"> Acción</option>
                        <option value="Drama"> Drama</option>
                        <option value="Comedia"> Comedia</option>
                        <option value="Terror"> Terror</option>
                        <option value="Ciencia Ficcion"> Ciencia Ficción</option>
                        <option value="Romance"> Romance</option>
                        <option value="Thriller"> Thriller</option>
                        <option value="Aventura"> Aventura</option>
                        <option value="Animacion"> Animación</option>
                        <option value="Documental"> Documental</option>
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
                      <Field
                        as={TextInput}
                        name="fechaEstreno"
                        type="date"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="fechaEstreno" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                         Clasificación por Edad (MPAA)
                      </label>
                      <Field as={Select} name="MPAA" disabled={isSubmitting}>
                        <option value=""> Selecciona la clasificación</option>
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
                      placeholder="Ej: Un épico relato de superhéroes que enfrentan su mayor amenaza..."
                      rows={4}
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="sinopsis" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  {/* URLs y Upload */}
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
                         Póster de la Película
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isSubmitting}
                          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer cursor-pointer border border-gray-600 rounded-lg bg-slate-700 focus:ring-2 focus:ring-purple-500"
                        />
                        
                        {/* Preview de la imagen */}
                        {previewUrl && (
                          <div className="relative">
                            <img 
                              src={previewUrl} 
                              alt="Preview del póster" 
                              className="w-full h-32 object-cover rounded-lg border border-gray-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                setPreviewUrl(isEditing && peliculaToEdit.portada ? peliculaToEdit.portada : null);
                                // Reset file input
                                const fileInput = document.querySelector('input[type="file"]');
                                if (fileInput) fileInput.value = '';
                              }}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                              disabled={isSubmitting}
                            >
                              ×
                            </button>
                          </div>
                        )}
                        
                        <p className="text-gray-400 text-xs">
                          Formatos: JPG, PNG, WEBP. Máximo 5MB. Se redimensionará automáticamente a 500x750px.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6 justify-center border-t border-gray-600">
                    <Button 
                      type="button" 
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-8 !bg-red-600 hover:!bg-red-700"
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
      <ErrorModal error={error} onClose={hideError} />
    </>
  );
}

export default ModalPeliculas;
export { ModalPeliculas };