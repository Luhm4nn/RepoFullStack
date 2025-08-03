import {Link} from 'react-router-dom';
import { useState } from 'react'

export default function Navbar() {
  return (
    <nav className="bg-purple-800 text-white flex justify-between items-center">
      <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Cutzy</h1>
        <ul className="flex space-x-4">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/Peliculas">Peliculas</Link></li>
            <li><Link to="/Salas">Salas</Link></li>
            <li><Link to="/Funciones">Funciones</Link></li>
            <li><Link to="/Configuracion">Configuracion</Link></li>
        </ul>
    </nav>
  );
}