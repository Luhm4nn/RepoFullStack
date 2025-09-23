import { TextInput, Button } from "flowbite-react";

/**
 * VERSIÓN MEJORADA - Recibe solo el hook de filtros
 * Ventajas:
 * - Una sola prop en lugar de 13
 * - Menor acoplamiento
 * - Más fácil de mantener
 * - API más limpia
 */
function FuncionesInlineFilters({ filterHook }) {
  const {
    filtros,
    peliculasSugeridas,
    salasSugeridas,
    mostrarSugerenciasPeliculas,
    mostrarSugerenciasSalas,
    handlePeliculaChange,
    handleSalaChange,
    handleFilterChange,
    seleccionarSugerenciaPelicula,
    seleccionarSugerenciaSala,
    limpiarFiltros,
    setMostrarSugerenciasPeliculas,
    setMostrarSugerenciasSalas
  } = filterHook;

  return (
    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Pelicula filter */}
        <div className="relative">
          <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
            </svg>
            Película
          </label>
          <div className="relative">
            <TextInput
              type="text"
              placeholder="Buscar película..."
              value={filtros.pelicula}
              onChange={(e) => handlePeliculaChange(e.target.value)}
              className="pr-8"
              onBlur={() => {
                setTimeout(() => setMostrarSugerenciasPeliculas(false), 200);
              }}
              onFocus={() => {
                if (peliculasSugeridas.length > 0) {
                  setMostrarSugerenciasPeliculas(true);
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {mostrarSugerenciasPeliculas && peliculasSugeridas.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-md mt-1 z-50 shadow-lg">
                {peliculasSugeridas.map((pelicula) => (
                  <div
                    key={pelicula.idPelicula}
                    className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-white text-sm"
                    onClick={() => seleccionarSugerenciaPelicula(pelicula)}
                  >
                    {pelicula.nombrePelicula}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sala filter */}
        <div className="relative">
          <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Sala
          </label>
          <div className="relative">
            <TextInput
              type="text"
              placeholder="Buscar sala..."
              value={filtros.sala}
              onChange={(e) => handleSalaChange(e.target.value)}
              className="pr-8"
              onBlur={() => {
                setTimeout(() => setMostrarSugerenciasSalas(false), 200);
              }}
              onFocus={() => {
                if (salasSugeridas.length > 0) {
                  setMostrarSugerenciasSalas(true);
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {mostrarSugerenciasSalas && salasSugeridas.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-md mt-1 z-50 shadow-lg">
                {salasSugeridas.map((sala) => (
                  <div
                    key={sala.idSala}
                    className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-white text-sm"
                    onClick={() => seleccionarSugerenciaSala(sala)}
                  >
                    {sala.nombreSala}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date from */}
        <div>
          <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Desde
          </label>
          <TextInput
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
          />
        </div>

        {/* Date to */}
        <div>
          <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Hasta
          </label>
          <TextInput
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
          />
        </div>

        {/* Clear button */}
        <div className="flex items-end">
          <Button
            onClick={limpiarFiltros}
            className="w-full !bg-slate-500 hover:!bg-slate-600 text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FuncionesInlineFilters;
