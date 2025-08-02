import {Link} from 'react-router-dom';
import { useState } from 'react'

export default function Navbar() {
  return (
    <nav>
      <h1>My App</h1>
        <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/Peliculas">Peliculas</Link></li>
            <li><Link to="/Salas">Salas</Link></li>
            <li><Link to="/Funciones">Funciones</Link></li>
            <li><Link to="/Configuracion">Configuracion</Link></li>
        </ul>
    </nav>
  );
}