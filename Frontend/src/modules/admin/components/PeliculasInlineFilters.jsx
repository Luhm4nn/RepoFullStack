import { TextInput, Select, Button } from "flowbite-react";
import { GENEROS_PELICULAS } from "../../../constants";

/**
 * Componente de filtros inline para películas
 * Preparado para búsqueda por nombre/director y filtro por género
 */
function PeliculasInlineFilters({ filterHook }) {
  const { 
    filtros, 
    handleBusquedaChange, 
    handleGeneroChange,
    limpiarFiltros 
  } = filterHook;

  return (
    <div className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda por nombre o director */}
        <div>
          <label htmlFor="busqueda" className="block text-sm font-medium text-white mb-2">
             Buscar
          </label>
          <TextInput
            id="busqueda"
            type="text"
            placeholder="Buscar por título o director..."
            value={filtros.busqueda}
            onChange={(e) => handleBusquedaChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filtro por género */}
        <div>
          <label htmlFor="genero" className="block text-sm font-medium text-white mb-2">
             Género
          </label>
          <Select
            id="genero"
            value={filtros.genero}
            onChange={(e) => handleGeneroChange(e.target.value)}
            className="w-full"
          >
            <option value="">Todos los géneros</option>
            {GENEROS_PELICULAS.map((genero) => (
              <option key={genero.value} value={genero.value}>
                {genero.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Botón limpiar filtros */}
        <div className="flex items-end">
          <Button
            onClick={limpiarFiltros}
            className="w-full bg-slate-600 hover:bg-slate-700"
          >
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PeliculasInlineFilters;
