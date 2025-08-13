import { getTarifas, createTarifa } from "../api/Tarifas.api";
import { Card, Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import formatearFecha from "../utils/formatearFecha";
import { formatearPrecio } from "../utils/formatearPrecio";
import TarifaForm from "./TarifaForm";

function TarifasList() {
  const [tarifas, setTarifas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTarifas();
  }, []);

  const fetchTarifas = async () => {
    try {
      setLoading(true);
      const data = await getTarifas();
      setTarifas(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching tarifas:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (data) => {
    try {
      await createTarifa(data);
      // Recargar la lista después de crear
      await fetchTarifas();
      closeModal();
    } catch (error) {
      console.error("Error creating tarifa:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const openModal = () => {
    setMostrarFormulario(true);
  };

  const closeModal = () => {
    setMostrarFormulario(false);
  };

  if (loading) {
    return <div className="text-center p-4 text-white">Cargando Tarifas...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-white text-xl">No se encontraron Tarifas cargadas.</p>
        <button 
          onClick={fetchTarifas} 
          className="mt-2 px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-700 text-white rounded transition-colors text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Modal
        show={mostrarFormulario}
        onClose={closeModal}
        size="xl"
        theme={{
          content: {
            base: "relative h-full w-full p-4 flex items-center justify-center min-h-screen",
            inner: "relative rounded-lg bg-slate-800 shadow flex flex-col max-h-[90vh] w-full max-w-md mx-auto"
          }
        }}
      >
        <ModalBody className="p-0">
          <TarifaForm 
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </ModalBody>
      </Modal>

      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6">
          <div className="flex flex-row items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Tarifas</h3>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={openModal}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="2.5" 
                stroke="currentColor" 
                className="w-4 h-4 mr-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nueva
            </Button>
          </div>
          
          <div className="space-y-4">
            {tarifas.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No hay tarifas registradas
              </div>
            ) : (
              tarifas.map((tar) => (
                <div key={tar.idTarifa} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">
                        {tar.descripcionTarifa || 'Sin descripción'}
                      </h4>
                      <p className="text-2xl font-bold text-green-400">
                        {formatearPrecio(tar.precio)}
                      </p>
                      <span className="text-xs text-gray-400">
                        {"Fecha de Vigencia: " + formatearFecha(tar.fechaDesde)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TarifasList;