import { getTarifas } from "../api/Tarifas.api";
import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import formatearFecha from "../utils/formatearFecha";
import { formatearPrecio } from "../utils/formatearPrecio";

function TarifasList() {
  const [tarifas, setTarifas] = useState([]);
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

  if (loading) {
    return <div className="text-center p-4 text-white">Cargando Tarifas...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-white text-xl">No se encontraron Tarifas cargados.</p>
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
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Tarifas</h3>
          
          <div className="space-y-4">
            {tarifas.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No hay tarifas registrados
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