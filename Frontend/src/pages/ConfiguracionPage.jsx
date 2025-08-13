import { useState } from "react";
import ParametrosList from "../components/ParametrosList";
import TarifasList from "../components/TarifasList";

function ConfiguracionPage() {
  const [refreshList, setRefreshList] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Configuración del Sistema</h1>
          <span className="text-gray-300 block mb-3 mt-1">
            Gestiona parámetros del sistema y tarifas del cine
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Parámetros */}
          <ParametrosList key={refreshList} />
          
          {/* Tarifas */}
          <TarifasList key={refreshList} />

    
      </div>
        </div>
      </div>
  );
}

export default ConfiguracionPage;