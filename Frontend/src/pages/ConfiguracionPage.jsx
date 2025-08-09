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
            Gestiona parámetros y tarifas del cine
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Parámetros */}
          <ParametrosList key={refreshList} />
          
          {/* Placeholder para Tarifas (próximo paso) */}
          <TarifasList key={refreshList} />

        {/* Placeholder para Configuración de Notificaciones (próximo paso) */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Configuración de Notificaciones</h3>
          <div className="text-center py-8 text-gray-400">
            Próximamente...
          </div>
        </div>
      </div>
        </div>
      </div>
  );
}

export default ConfiguracionPage;