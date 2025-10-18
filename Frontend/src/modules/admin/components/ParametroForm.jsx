import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { parametrosSchema } from "../../../validations/ParametrosSchema.js";

export default function ParametrosForm({ onSubmit, onCancel, initialData = null, isEditing = false }) {
  // Verificar si es uno de los primeros dos parámetros del sistema
  const isSystemParameter = initialData && initialData.idParametro <= 2;
  // Valores iniciales: usar datos del parámetro a editar o valores vacíos
  const initialValues = initialData ? {
    descripcionParametro: initialData.descripcionParametro || '',
    valor: initialData.valor || '',
  } : {
    descripcionParametro: '',
    valor: '',
  };

  return (
    <div className="bg-slate-800 border-slate-700 p-4 md:p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-4">
        {isEditing ? 'Editar Parámetro' : 'Agregar Nuevo Parámetro'}
      </h2>
      
      {/* Mensaje informativo para parámetros del sistema */}
      {isSystemParameter && (
        <div className="mb-4 p-3 bg-blue-900/50 border border-blue-600 rounded-lg">
          <p className="text-blue-200 text-sm">
            <span className="font-medium">Parámetro del sistema:</span> Solo puedes modificar el valor, la descripción no se puede cambiar.
          </p>
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={parametrosSchema}
        enableReinitialize={true} // Importante: permite que los valores se actualicen cuando cambie initialData
        onSubmit={(values, { resetForm, setSubmitting }) => {
          onSubmit(values); 
          resetForm(); 
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
            
              {/* Descripción */}
              <div>
                <Label htmlFor="descripcionParametro" value="Descripción del Parámetro *" />
                <Field
                  as={TextInput}
                  name="descripcionParametro"
                  type="text"
                  placeholder="Ej: Tiempo de limpieza entre funciones"
                  color
                  className={`${isSystemParameter ? 'bg-gray-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-white/10'} text-white`}
                  disabled={isSystemParameter}
                  readOnly={isSystemParameter}
                />
                <ErrorMessage name="descripcionParametro" component="span" className="text-red-500 text-sm" />
                {isSystemParameter && (
                  <p className="text-xs text-gray-400 mt-1">
                    Este es un parámetro del sistema y su descripción no puede modificarse.
                  </p>
                )}
              </div>

              {/* Valor */}
              <div>
                <Label htmlFor="valor" value="Valor *" />
                <Field
                  as={TextInput}
                  name="valor"
                  type="number"
                  placeholder="30"
                  color
                  className="bg-slate-700 hover:bg-white/10 text-white"
                />
                <ErrorMessage name="valor" component="span" className="text-red-500 text-sm" />
                <p className="text-xs text-gray-400 mt-1">
                  Ingresa el valor numérico del parámetro (ej: minutos, porcentaje, cantidad)
                </p>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  color 
                  className="text-white bg-slate-700 hover:bg-white/10" 
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  color 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isSubmitting 
                    ? (isEditing ? "Actualizando..." : "Guardando...") 
                    : (isEditing ? "Actualizar Parámetro" : "Guardar Parámetro")
                  }
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}