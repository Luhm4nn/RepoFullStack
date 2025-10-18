import { TextInput, Button } from "flowbite-react";

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
          <label className="text-sm font-medium text-white mb-1 block">
            Película
          </label>
          <div className="relative w-full">
            <TextInput
              type="text"
              placeholder="Buscar película..."
              value={filtros.pelicula}
              onChange={(e) => handlePeliculaChange(e.target.value)}
              color
              className="w-full !bg-slate-700 hover:!bg-slate-600 text-white border-slate-600 rounded-lg"
              onBlur={() => setTimeout(() => setMostrarSugerenciasPeliculas(false), 200)}
              onFocus={() => peliculasSugeridas.length > 0 && setMostrarSugerenciasPeliculas(true)}
            />
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
          <label className="text-sm font-medium text-white mb-1 block">
            Sala
          </label>
          <div className="relative w-full">
            <TextInput
              type="text"
              placeholder="Buscar sala..."
              value={filtros.sala}
              onChange={(e) => handleSalaChange(e.target.value)}
              color
              className="w-full !bg-slate-700 hover:!bg-slate-600 text-white border-slate-600 rounded-lg"
              onBlur={() => setTimeout(() => setMostrarSugerenciasSalas(false), 200)}
              onFocus={() => salasSugeridas.length > 0 && setMostrarSugerenciasSalas(true)}
            />
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
        <div className="relative">
          <label className="text-sm font-medium text-white mb-1 block">
            Desde
          </label>
          <TextInput
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
            color
            className="w-full !bg-slate-700 hover:!bg-slate-600 text-white border-slate-600 rounded-lg [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>

        {/* Date to */}
        <div className="relative">
          <label className="text-sm font-medium text-white mb-1 block">
            Hasta
          </label>
          <TextInput
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
            color
            className="w-full !bg-slate-700 hover:!bg-slate-600 text-white border-slate-600 rounded-lg [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>

        {/* Clear button */}
        <div className="flex items-end">
          <Button
            onClick={limpiarFiltros}
            className="w-full !bg-slate-500 hover:!bg-slate-600 text-white"
          >
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FuncionesInlineFilters;