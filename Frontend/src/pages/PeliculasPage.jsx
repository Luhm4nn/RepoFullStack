import { useState } from "react";
import PeliculasForm from "../components/PeliculasForm";


function PeliculasPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [peliculas, setPeliculas] = useState([]);

  const manejarSubmit = (nuevaPelicula) => {
    setPeliculas([...peliculas, nuevaPelicula]);
    setMostrarFormulario(false);
  };

  return (
    <div>
      <h1>Películas</h1>
      <h2 >Lista de Películas</h2>

      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        {mostrarFormulario ? "Cancelar" : "Añadir Película"}
      </button>

      {mostrarFormulario && <PeliculasForm onSubmit={manejarSubmit} />}

      <div>
        {peliculas.length === 0 ? (
          <p>No hay películas registradas.</p>
        ) : (
          <ul>
            {peliculas.map((p, index) => (
              <li key={index}>
                {p.titulo} - {p.director} ({p.anio})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PeliculasPage;
