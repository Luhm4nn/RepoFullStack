import {Link} from 'react-router-dom';
import { useState } from 'react';
import cutzyLogo from '../assets/cutzy-logo-blanco.png';

export default function FooterComp() {
  return (
<footer class="bg-slate-900">
    <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
            <a class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <img src={cutzyLogo} class="h-8" alt="Cutzy Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">Cutzy Cinema</span>
            </a>
            <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                <li>
                    <Link to="/Terminos" class="hover:underline me-4 md:me-6">Términos y Condiciones</Link>
                </li>
                <li>
                    <Link to="/Privacity" class="hover:underline me-4 md:me-6">Política de Privacidad</Link>
                </li>
                <li>
                    <Link to="/AboutMe" class="hover:underline me-4 md:me-6">Sobre Nosotros</Link>
                </li>
                <li>
                    <Link to="/FAQ" class="hover:underline me-4 md:me-6">FAQ</Link>
                </li>
            </ul>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span class="block text-sm text-gray-500 sm:text-center">© 2025 CUTZY. Todos los derechos reservados.</span>
    </div>
</footer>
    );
    }