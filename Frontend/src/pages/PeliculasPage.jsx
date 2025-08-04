import { useState } from "react";
import PeliculasList from "../components/PeliculasList";
import ModalPeliculas from "../components/ModalPeliculas";

function PeliculasPage() {
  const [refreshList, setRefreshList] = useState(0);

  const handleMovieAdded = () => {
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl text-gray-200 font-bold">Gestión de Películas</h1>
        <span className="text-gray-300 mt-1 mb-5 block">
          Aquí puedes gestionar las películas del cine.
        </span>
        
        <div className="mb-6">
          <ModalPeliculas onSuccess={handleMovieAdded} />
        </div>

        <PeliculasList key={refreshList} />
      </div>
    </div>
  );
}

export default PeliculasPage;