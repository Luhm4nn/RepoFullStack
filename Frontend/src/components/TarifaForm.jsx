import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import tarifasSchema from "../validations/TarifasSchema";

export default function TarifaForm({ onSubmit, onCancel }) {
  return (
    <div className="bg-slate-800 border-slate-700 p-4 md:p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-4">Agregar Nueva Tarifa</h2>
      
      <Formik
        initialValues={{ 
          descripcionTarifa: '',
          precio: '',
        }}
        validationSchema={tarifasSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          // Agregar la fecha actual al momento del envío
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
                  className="bg-slate-700 hover:bg-white/10 text-white"
                />
                <ErrorMessage name="descripcionTarifa" component="span" className="text-red-500 text-sm" />
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
                  Ingresa el precio en pesos argentinos. La fecha de vigencia será la fecha actual.
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
                  {isSubmitting ? "Guardando..." : "Guardar Tarifa"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}