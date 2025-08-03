import {Link} from 'react-router-dom';
import { useState } from 'react';
import cutzyLogo from '../assets/cutzy-logo-blanco.png';

export default function FooterComp() {
  return (
<footer className="bg-slate-900">
    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
            <a className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <img src={cutzyLogo} className="h-8" alt="Cutzy Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Cutzy Cinema</span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
                <li>
                    <Link to="/Terminos" className="hover:underline me-4 md:me-6">Términos y Condiciones</Link>
                </li>
                <li>
                    <Link to="/Privacity" className="hover:underline me-4 md:me-6">Política de Privacidad</Link>
                </li>
                <li>
                    <Link to="/AboutMe" className="hover:underline me-4 md:me-6">Sobre Nosotros</Link>
                </li>
                <li>
                    <Link to="/FAQ" className="hover:underline me-4 md:me-6">FAQ</Link>
                </li>
            </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center">© 2025 CUTZY. Todos los derechos reservados.</span>
    </div>
</footer>
    );
    }