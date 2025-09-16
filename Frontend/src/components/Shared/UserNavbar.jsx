import {Link} from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <h1>My App</h1>
        <ul className='flex justify-around  bg-gray-800 p-4 text-white'>
            <div className='bg-violet-700 text-amber-500 w-min'><Link to="/">Inicio</Link></div>
            <div className='bg-violet-700 text-amber-500 w-min'><Link to="/Peliculas">Peliculas</Link></div>
            <div className='bg-violet-700 text-amber-500 w-min'><Link to="/Salas">Salas</Link></div>
            <div className='bg-violet-700 text-amber-500 w-min'><Link to="/Funciones">Funciones</Link></div>
            <div className='bg-violet-700 text-amber-500 w-min'><Link to="/Configuracion">Configuracion</Link></div>
        </ul>
    </nav>
  );
}