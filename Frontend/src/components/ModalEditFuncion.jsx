import { useState } from "react";
import { updateFuncion } from "../api/Funciones.api";
import FuncionesForm from "./FuncionesForm";

function ModalEditFuncion({ funcion, onSuccess, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      console.log("Actualizando función con valores:", values);
      
      await updateFuncion(funcion.idSala, funcion.fechaHoraFuncion, values);
      onSuccess();
    } catch (error) {
      console.error("Error actualizando función:", error);
      alert("Error al actualizar la función: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!funcion) return null;

  return (
    <div className="relative bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Editar Función
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Información actual */}
      <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
        <h3 className="text-white font-semibold mb-2">Función actual:</h3>
        <div className="text-gray-300 text-sm space-y-1">
          <p><strong>Película:</strong> {funcion.pelicula?.nombrePelicula}</p>
          <p><strong>Sala:</strong> {funcion.sala?.idSala} - {funcion.sala?.ubicacion}</p>
          <p><strong>Estado:</strong> <span className={`font-bold ${funcion.estado === 'Privada' ? 'text-red-500' : 'text-green-500'}`}>{funcion.estado}</span></p>
        </div>
      </div>

      {/* Formulario reutilizado sin el fondo duplicado */}
      <div className="bg-transparent p-0 rounded-none shadow-none">
        <FuncionesForm 
          onSubmit={handleSubmit}
          initialValues={funcion}
          isEditing={true}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}

export default ModalEditFuncion;
