import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Label, Select } from "flowbite-react";
import VIPSeatSelector from "./VIPSeatSelector";
import { useState, useEffect } from "react";
import salaSchema from "../../validations/SalasSchema.js";
import { getAsientosBySala } from "../../api/Salas.api";

export default function SalasEditForm({ sala, onSubmit, onCancel }) {
  const [vipSeats, setVipSeats] = useState([]);
  const [currentVipSeats, setCurrentVipSeats] = useState([]);

  // Cargar asientos VIP actuales cuando se monta el componente
  useEffect(() => {
    const fetchCurrentVipSeats = async () => {
      try {
        // Importar la función de la API
        const asientos = await getAsientosBySala(sala.idSala);
        
        const vipSeatsFromDb = asientos
          .filter(asiento => asiento.tipo === "VIP")
          .map(asiento => `${asiento.filaAsiento}${asiento.nroAsiento}`);
        
        setCurrentVipSeats(vipSeatsFromDb);
        setVipSeats(vipSeatsFromDb);
      } catch (error) {
        console.error("Error fetching current VIP seats:", error);
        // En caso de error, usar array vacío
        setCurrentVipSeats([]);
        setVipSeats([]);
      }
    };

    if (sala?.idSala) {
      fetchCurrentVipSeats();
    }
  }, [sala]);

  if (!sala) {
    return (
      <div className="bg-slate-800 border-slate-700 p-4 md:p-6 rounded-lg shadow-lg">
        <p className="text-white">No se encontró información de la sala.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border-slate-700 p-4 md:p-6 overflow-hidden scrollbar-none rounded-lg shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-4">
        Editar Sala {sala.idSala}
      </h2>
      
      <Formik
        initialValues={{ 
          ubicacion: sala.ubicacion || '',
        }}
        validationSchema={salasEditSchema}
        onSubmit={(values, { setSubmitting }) => {
          const dataToSubmit = {
            ...values,
            vipSeats: vipSeats
          };
          onSubmit(dataToSubmit, sala.idSala); 
          setSubmitting(false);
        }}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              
              {/* Información de la sala (solo lectura) */}
              <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                <h3 className="text-white font-semibold mb-2">Información de la Sala</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Filas:</span>
                    <span className="text-white ml-2">{sala.filas}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Asientos por fila:</span>
                    <span className="text-white ml-2">{sala.asientosPorFila}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Capacidad:</span>
                    <span className="text-white ml-2">{sala.filas * sala.asientosPorFila} asientos</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Asientos VIP actuales:</span>
                    <span className="text-yellow-400 ml-2">{currentVipSeats.length}</span>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div >
                <Label htmlFor="ubicacion" value="Ubicación *" />
                <Field as={Select} name="ubicacion" color className="bg-slate-700 hover:bg-white/10 text-white">
                  <option value="" className="bg-slate-700 border-slate-600 hover:bg-white/10 text-white" >Selecciona una ubicación</option>
                  <option value="Ala Derecha" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Ala Derecha</option>
                  <option value="Ala Izquierda" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Ala Izquierda</option>
                  <option value="Planta Baja" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Planta Baja</option>
                  <option value="Sótano" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Sótano</option>
                  <option value="Primer Piso" className="bg-slate-700 hover:bg-white/10 border-slate-600 text-white">Primer Piso</option>
                </Field>
                <ErrorMessage name="ubicacion" component="span" className="text-red-500 text-sm" />
              </div>

              {/* Configuración de Asientos VIP */}
              <div>
                <Label value="Configuración de Asientos VIP" />
                <div className="mt-2">
                  <VIPSeatSelector
                    filas={sala.filas}
                    asientosPorFila={sala.asientosPorFila}
                    initialVipSeats={currentVipSeats}
                    onVIPSeatsChange={setVipSeats}
                    key={`edit-${sala.idSala}-${currentVipSeats.join(',')}`}
                  />
                </div>

                {vipSeats.length > 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Asientos VIP seleccionados:</strong> {vipSeats.join(', ')}
                    </p>
                  </div>
                )}

                {/* Mostrar cambios si los hay */}
                {JSON.stringify([...vipSeats].sort()) !== JSON.stringify([...currentVipSeats].sort()) && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Cambios detectados:</strong> 
                      {vipSeats.length > currentVipSeats.length && " Se agregarán asientos VIP"}
                      {vipSeats.length < currentVipSeats.length && " Se eliminarán asientos VIP"}
                      {vipSeats.length === currentVipSeats.length && " Se modificarán asientos VIP"}
                    </p>
                  </div>
                )}
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
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-sm"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}