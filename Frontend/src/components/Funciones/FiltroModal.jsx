import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, Select, TextInput, Label, Button } from "flowbite-react";
import { getPeliculas } from "../../api/Peliculas.api";
import { getSalas } from "../../api/Salas.api";

const FiltroModal = ({ 
  show, 
  onClose, 
  onApplyFilter,
  onClearFilter,
  funcionesSinFiltrar = []
}) => {
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [filtros, setFiltros] = useState({
    pelicula: '',
    sala: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show]);

  const fetchData = async () => {
    try {
      const [peliculasData, salasData] = await Promise.all([
        getPeliculas(),
        getSalas()
      ]);
      setPeliculas(peliculasData);
      setSalas(salasData);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const aplicarFiltros = () => {
    console.log('Aplicando filtros:', filtros);
    console.log('Funciones sin filtrar:', funcionesSinFiltrar);
    
    let funcionesFiltradas = [...funcionesSinFiltrar];

    // Filtro por película
    if (filtros.pelicula) {
      funcionesFiltradas = funcionesFiltradas.filter(
        funcion => funcion.idPelicula === parseInt(filtros.pelicula)
      );
    }

    // Filtro por sala
    if (filtros.sala) {
      funcionesFiltradas = funcionesFiltradas.filter(
        funcion => funcion.idSala === parseInt(filtros.sala)
      );
    }

    // Filtro por fecha desde
    if (filtros.fechaDesde) {
      const fechaDesde = new Date(filtros.fechaDesde + 'T00:00:00');
      console.log('Fecha desde:', fechaDesde);
      funcionesFiltradas = funcionesFiltradas.filter(
        funcion => {
          const fechaFuncion = new Date(funcion.fechaHoraFuncion);
          console.log('Comparando función fecha:', fechaFuncion, '>=', fechaDesde, '=', fechaFuncion >= fechaDesde);
          return fechaFuncion >= fechaDesde;
        }
      );
    }

    // Filtro por fecha hasta
    if (filtros.fechaHasta) {
      const fechaHasta = new Date(filtros.fechaHasta + 'T23:59:59');
      console.log('Fecha hasta:', fechaHasta);
      funcionesFiltradas = funcionesFiltradas.filter(
        funcion => {
          const fechaFuncion = new Date(funcion.fechaHoraFuncion);
          console.log('Comparando función fecha:', fechaFuncion, '<=', fechaHasta, '=', fechaFuncion <= fechaHasta);
          return fechaFuncion <= fechaHasta;
        }
      );
    }

    console.log('Funciones filtradas:', funcionesFiltradas);
    onApplyFilter(funcionesFiltradas);
    onClose();
  };

  const limpiarFiltros = () => {
    setFiltros({
      pelicula: '',
      sala: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    onClearFilter();
  };

  const updateFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  return (
    <Modal show={show} onClose={onClose} size="md">
      <ModalHeader className="bg-slate-800 text-white border-slate-700">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.25.477 7.433 1.266a1 1 0 01.667.952v.888a5.25 5.25 0 01-1.54 3.713L16.5 12v4.5a1 1 0 01-.44.83L14.5 18.5a1 1 0 01-1.06.12A1 1 0 0113 18.5V14.121l-2.06-2.06A5.25 5.25 0 019.5 8.379v-.888a1 1 0 01.667-.952C12.25 3.477 14.745 3 12 3z" />
          </svg>
          Filtrar Funciones
        </div>
      </ModalHeader>
      <ModalBody className="bg-slate-800 text-white">
        <div className="space-y-4">
          {/* Filtro por película */}
          <div>
            <Label htmlFor="pelicula" value="Película" className="text-white mb-2 block" />
            <Select
              id="pelicula"
              value={filtros.pelicula}
              onChange={(e) => updateFiltro('pelicula', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            >
              <option value="">Todas las películas</option>
              {peliculas.map(pelicula => (
                <option key={pelicula.idPelicula} value={pelicula.idPelicula}>
                  {pelicula.nombrePelicula}
                </option>
              ))}
            </Select>
          </div>

          {/* Filtro por sala */}
          <div>
            <Label htmlFor="sala" value="Sala" className="text-white mb-2 block" />
            <Select
              id="sala"
              value={filtros.sala}
              onChange={(e) => updateFiltro('sala', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            >
              <option value="">Todas las salas</option>
              {salas.map(sala => (
                <option key={sala.idSala} value={sala.idSala}>
                  Sala {sala.idSala} - {sala.ubicacion}
                </option>
              ))}
            </Select>
          </div>

          {/* Filtro por fecha desde */}
          <div>
            <Label htmlFor="fechaDesde" value="Fecha desde" className="text-white mb-2 block" />
            <TextInput
              id="fechaDesde"
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => updateFiltro('fechaDesde', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Filtro por fecha hasta */}
          <div>
            <Label htmlFor="fechaHasta" value="Fecha hasta" className="text-white mb-2 block" />
            <TextInput
              id="fechaHasta"
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => updateFiltro('fechaHasta', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-600">
            <Button
              onClick={limpiarFiltros}
              className="!bg-slate-600 hover:!bg-slate-700 text-white"
            >
              Limpiar
            </Button>
            <Button
              onClick={aplicarFiltros}
              className="!bg-purple-600 hover:!bg-purple-700 text-white"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default FiltroModal;
