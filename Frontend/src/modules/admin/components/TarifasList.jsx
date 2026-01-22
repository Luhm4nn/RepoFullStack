import { getTarifas, updateTarifa } from '../../../api/Tarifas.api';
import { Card, Button, Modal, ModalBody } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { formatDate, formatearPrecio } from '../../shared';
import TarifaForm from './TarifaForm';
import { useNotification } from '../../../context/NotificationContext';

function TarifasList() {
  const [tarifas, setTarifas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tarifaEditar, setTarifaEditar] = useState(null);
  const notify = useNotification();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTarifas();
  }, []);

  const fetchTarifas = async () => {
    try {
      setLoading(true);
      const data = await getTarifas();
      // Asegurar que data sea siempre un array
      setTarifas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      setError(error.message);
      setTarifas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (tarifaEditar) {
        // Editar tarifa existente
        await updateTarifa(tarifaEditar.idTarifa, data);
        await fetchTarifas();
        closeModal();
      }
    } catch (error) {}
  };

  // Eliminar función de crear tarifa

  const openEditModal = (tarifa) => {
    setTarifaEditar(tarifa);
    setMostrarFormulario(true);
  };

  const closeModal = () => {
    setMostrarFormulario(false);
    setTarifaEditar(null);
  };

  // Eliminar funciones de eliminar tarifa

  return (
    <div className="w-full">
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6">
          <div className="flex flex-row items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Tarifas</h3>
          </div>
          <div className="space-y-4">
            {tarifas.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No hay tarifas registradas</div>
            ) : (
              tarifas.map((tarifa) => (
                <div key={tarifa.idTarifa} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">
                        {tarifa.descripcionTarifa || 'Sin descripción'}
                      </h4>
                      <p className="text-2xl font-bold text-green-400">
                        {formatearPrecio(tarifa.precio)}
                      </p>
                      <span className="text-xs text-gray-400">
                        Fecha de Vigencia: {formatDate(tarifa.fechaDesde)}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-sm"
                        onClick={() => openEditModal(tarifa)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Modal de edición de tarifa */}
      <Modal
        show={mostrarFormulario}
        onClose={closeModal}
        size="xl"
        theme={{
          content: {
            base: 'relative h-full w-full p-4 flex items-center justify-center min-h-screen',
            inner:
              'relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto',
          },
        }}
      >
        <ModalBody className="p-0">
          {tarifaEditar && (
            <TarifaForm
              onSubmit={handleSubmit}
              onCancel={closeModal}
              initialData={tarifaEditar}
              isEditing={!!tarifaEditar}
            />
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default TarifasList;
export { TarifasList };
