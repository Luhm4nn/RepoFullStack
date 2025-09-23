import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { tarifasSchema } from "../validations/TarifasSchema.js";

export default function TarifaForm({ onSubmit, onCancel, initialData = null, isEditing = false }) {
  // Verificar si es una de las primeras dos tarifas del sistema
  const isSystemTarifa = initialData && initialData.idTarifa <= 2;

  // Valores iniciales: usar datos de la tarifa a editar o valores vacíos
  const initialValues = initialData ? {
    descripcionTarifa: initialData.descripcionTarifa || '',
    precio: initialData.precio || '',
  } : {
    descripcionTarifa: '',
    precio: '',
  };
  return (
    <div className="bg-slate-800 border-slate-700 p-4 md:p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-4">
        {isEditing ? 'Editar Tarifa' : 'Agregar Nueva Tarifa'}
      </h2>
      
      {/* Mensaje informativo para tarifas del sistema */}
      {isSystemTarifa && (
        <div className="mb-4 p-3 bg-blue-900/50 border border-blue-600 rounded-lg">
          <p className="text-blue-200 text-sm">
            <span className="font-medium">Tarifa del sistema:</span> Solo puedes modificar el precio, la descripción no se puede cambiar.
          </p>
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={tarifasSchema}
        enableReinitialize={true} // Importante: permite que los valores se actualicen cuando cambie initialData
        onSubmit={(values, { resetForm, setSubmitting }) => {
          // Siempre agregar la fecha actual al momento del envío (tanto para crear como para editar)
          const dataWithDate = {
            ...values,
            fechaDesde: new Date().toISOString()
          };
          onSubmit(dataWithDate); 
          resetForm(); 
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
            
              {/* Descripción */}
              <div>
                <Label htmlFor="descripcionTarifa" value="Descripción de la Tarifa *" />
                <Field
                  as={TextInput}
                  name="descripcionTarifa"
                  type="text"
                  placeholder="Ej: Tarifa General, Tarifa Estudiantes, etc."
                  color
                  className={`${isSystemTarifa ? 'bg-gray-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-white/10'} text-white`}
                  disabled={isSystemTarifa}
                  readOnly={isSystemTarifa}
                />
                <ErrorMessage name="descripcionTarifa" component="span" className="text-red-500 text-sm" />
                {isSystemTarifa && (
                  <p className="text-xs text-gray-400 mt-1">
                    Esta es una tarifa del sistema y su descripción no puede modificarse.
                  </p>
                )}
              </div>

              {/* Precio */}
              <div>
                <Label htmlFor="precio" value="Precio *" />
                <Field
                  as={TextInput}
                  name="precio"
                  type="number"
                  step="0.01"
                  placeholder="1500.00"
                  color
                  className="bg-slate-700 hover:bg-white/10 text-white"
                />
                <ErrorMessage name="precio" component="span" className="text-red-500 text-sm" />
                <p className="text-xs text-gray-400 mt-1">
                  {isEditing ? 
                    "Ingresa el nuevo precio. La fecha de vigencia se actualizará a la fecha actual." :
                    "Ingresa el precio en pesos argentinos. La fecha de vigencia será la fecha actual."
                  }
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
                    : (isEditing ? "Actualizar Tarifa" : "Guardar Tarifa")
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