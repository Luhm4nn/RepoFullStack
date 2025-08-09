import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import parametrosSchema from "../validations/ParametrosSchema";



export default function ParametrosForm({ onSubmit, onCancel }) {
  return (
    <div className="bg-slate-800 border-slate-700 p-4 md:p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-4">Agregar Nuevo Parámetro</h2>
      
      <Formik
        initialValues={{ 
          descripcionParametro: '',
          valor: '',
        }}
        validationSchema={parametrosSchema}
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
                  className="bg-slate-700 hover:bg-white/10 text-white"
                />
                <ErrorMessage name="descripcionParametro" component="span" className="text-red-500 text-sm" />
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
                  {isSubmitting ? "Guardando..." : "Guardar Parámetro"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}