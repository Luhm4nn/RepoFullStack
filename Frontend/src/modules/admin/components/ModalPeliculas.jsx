import { useState, useEffect } from "react";
import { Button, TextInput, Select, Textarea } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createPelicula, updatePelicula } from "../../../api/Peliculas.api";
import { peliculaSchema } from "../../../validations/PeliculasSchema.js";
import { dateFormaterBackend } from "../../../utils/dateFormater.js";
import useErrorModal from "../../shared/hooks/useErrorModal";
import ErrorModal from "../../shared/components/ErrorModal.jsx";
import { useNotification } from "../../../context/NotificationContext";
import { CLASIFICACIONES_MPAA, GENEROS_PELICULAS } from "../../../constants";

function ModalPeliculas({ onSuccess, peliculaToEdit = null, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { error, handleApiError, hideError } = useErrorModal();
  const notify = useNotification();
  const isEditing = !!peliculaToEdit;

  useEffect(() => {
    if (peliculaToEdit) {
      setShowModal(true);
      if (peliculaToEdit.portada) {
        setPreviewUrl(peliculaToEdit.portada);
      }
    }
  }, [peliculaToEdit]);

  const handleClose = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    hideError();
    if (onClose) {
      onClose();
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        notify.warning('Solo se permiten archivos de imagen');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        notify.warning('El archivo debe ser menor a 5MB');
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setSelectedFile(null);
      setPreviewUrl(isEditing && peliculaToEdit.portada ? peliculaToEdit.portada : null);
    }
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        const value = values[key];
        
        if (key === 'nombrePelicula' || key === 'director' || key === 'generoPelicula') {
          formData.append(key, value || '');
        }
        else if (key === 'duracion') {
          formData.append(key, parseInt(value) || 0);
        }
        else if (key === 'fechaEstreno') {
          if (value) {
            const formattedDate = dateFormaterBackend(value);
            formData.append(key, formattedDate);
          }
        }
        else if (key === 'MPAA') {
          if (value) {
            formData.append(key, value);
          }
        }
        else if (key === 'sinopsis' || key === 'trailerURL') {
          if (value) {
            formData.append(key, value);
          }
        }
      });

      if (selectedFile) {
        formData.append('portada', selectedFile);
      }

      if (isEditing) {
        await updatePelicula(peliculaToEdit.idPelicula, formData);
        notify.success(`Película "${values.nombrePelicula}" actualizada exitosamente`);
      } else {
        await createPelicula(formData);
        notify.success(`Película "${values.nombrePelicula}" creada exitosamente`);
      }

      handleClose();
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      const handled = handleApiError(error);
      if (!handled) {
        notify.handleError(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

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
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg"
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm "></div>
          <div className="relative scrollbar-thin bg-slate-800 border border-slate-700 p-4 md:p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg z-10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl text-white font-bold mb-4">
              {isEditing ? "Editar Película" : "Añadir Nueva Película"}
            </h2>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-3xl font-light"
            >
              ×
            </button>
            
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={peliculaSchema}
              enableReinitialize={true}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Título de la Película *
                      </label>
                      <Field
                        as={TextInput}
                        name="nombrePelicula"
                        placeholder="Ej: Avengers: Endgame"
                        disabled={isSubmitting}
                        color
                        className="bg-slate-700 hover:bg-white/10 text-white rounded-lg"
                      />
                      <ErrorMessage name="nombrePelicula" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Director *
                      </label>
                      <Field
                        as={TextInput}
                        name="director"
                        placeholder="Ej: Christopher Nolan"
                        disabled={isSubmitting}
                        color
                        className="bg-slate-700 hover:bg-white/10 text-white rounded-lg"
                      />
                      <ErrorMessage name="director" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Género Cinematográfico *
                      </label>
                      <Field as={Select} name="generoPelicula" disabled={isSubmitting} color className="bg-slate-700 hover:bg-white/10 text-white rounded-lg">
                        <option value="" className="bg-slate-700 border-slate-600 hover:bg-white/10 text-white">Selecciona el género principal</option>
                        {GENEROS_PELICULAS.map((genero) => (
                          <option key={genero.value} value={genero.value} className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">
                            {genero.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="generoPelicula" component="div" className="text-red-500 text-sm mt-1" />
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
                        color
                        className="bg-slate-700 hover:bg-white/10 text-white rounded-lg"
                      />
                      <ErrorMessage name="duracion" component="div" className="text-red-500 text-sm mt-1" />
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
                        color
                        className="bg-slate-700 hover:bg-white/10 text-white rounded-lg"
                      />
                      <ErrorMessage name="fechaEstreno" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Clasificación por Edad (MPAA)
                      </label>
                      <Field as={Select} name="MPAA" disabled={isSubmitting} color className="bg-slate-700 hover:bg-white/10 text-white rounded-lg">
                        <option value="" className="bg-slate-700 border-slate-600 hover:bg-white/10 text-white">Selecciona la clasificación</option>
                        {CLASIFICACIONES_MPAA.map((clasificacion) => (
                          <option 
                            key={clasificacion.value} 
                            value={clasificacion.value} 
                            className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white"
                          >
                            {clasificacion.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="MPAA" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
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
                      color
                      className="bg-slate-700 hover:bg-white/10 text-white rounded-lg"
                    />
                    <ErrorMessage name="sinopsis" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        URL del Trailer (YouTube)
                      </label>
                      <Field
                        as={TextInput}
                        name="trailerURL"
                        placeholder="Ej: https://youtube.com/watch?v=TcMBFSGVi1c"
                        disabled={isSubmitting}
                        color
                        className="bg-slate-700 hover:bg-white/10 text-white rounded-lg"
                      />
                      <ErrorMessage name="trailerURL" component="div" className="text-red-500 text-sm mt-1" />
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
                          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer cursor-pointer border border-slate-600 rounded-lg bg-slate-700 focus:ring-2 focus:ring-purple-500"
                        />
                        {previewUrl && (
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt="Preview del póster"
                              className="w-full h-32 object-cover rounded-lg border border-slate-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                setPreviewUrl(isEditing && peliculaToEdit.portada ? peliculaToEdit.portada : null);
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
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      color
                      className="text-white bg-slate-700 hover:bg-white/10 rounded-lg"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      color
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg"
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