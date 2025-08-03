import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";
import salasSchema from "../validations/SalasSchema";

export default function SalasForm({ onSubmit }) {
  return (
    <div className="bg-slate-800 border-slate-700 p-4 md:p-6 overflow-hidden rounded-lg scrollbar-hide shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-4">Agregar Nueva Sala</h2>
      
      <Formik
        initialValues={{ 
          ubicacion: '',
          filas: '',
          asientosPorFila: '',
        }}
        validationSchema={salasSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          onSubmit(values); 
          resetForm(); 
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 ">
            
            {/* Ubicacion */}
              <div >
                <Label htmlFor="ubicacion" value="Ubicación *" />
                <Field as={Select} name="ubicacion"  required color className="bg-slate-700 hover:bg-white/10 text-white">
                  <option value="" className="bg-slate-700 border-slate-600 hover:bg-white/10 text-white" >Selecciona una ubicación</option>
                  <option value="Ala Derecha" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Ala Derecha</option>
                  <option value="Ala Izquierda" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Ala Izquierda</option>
                  <option value="Planta Baja" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Planta Baja</option>
                  <option value="Sótano" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Sótano</option>
                  <option value="Primer Piso" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Primer Piso</option>
                </Field>
                <ErrorMessage name="ubicacion" component="span" className="text-red-500 text-sm" />
              </div>

            {/* Filas */}
              <div>
                <Label htmlFor="filas" value="Filas *" />
                <Field
                  as={TextInput}
                  name="filas"
                  type="number"
                  placeholder="10"
                  required
                  color
                  className="bg-slate-700 hover:bg-white/10 text-white"
                />
                <ErrorMessage name="filas" component="span" className="text-red-500 text-sm" />
              </div>

              {/* Asientos por fila */}
              <div>
                <Label htmlFor="asientosPorFila" value="Asientos por fila *" />
                <Field
                  as={TextInput}
                  name="asientosPorFila"
                  type="number"
                  placeholder="10"
                  required
                  color
                  className="bg-slate-700 hover:bg-white/10 text-white"
                />
                <ErrorMessage name="asientosPorFila" component="span" className="text-red-500 text-sm" />
              </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4">
              <Button type="button" color className="text-white bg-slate-700 hover:bg-white/10" onClick={() => window.location.reload()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} color className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                {isSubmitting ? "Guardando..." : "Guardar Sala"}
              </Button>
              
            </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}