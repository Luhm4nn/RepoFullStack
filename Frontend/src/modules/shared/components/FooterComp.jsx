import { Link } from 'react-router-dom';
import cutzyLogo from '../../../assets/cutzy-logo-blanco.png';

export default function FooterComp() {
  return (
    <footer className="bg-slate-900">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
          <a className="flex items-center gap-3">
            <img src={cutzyLogo} className="h-8" alt="Cutzy Logo" />
            <span className="text-xl md:text-2xl font-semibold text-white break-words">
              Cutzy Cinema
            </span>
          </a>

          <ul className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4 text-sm font-medium text-gray-400">
            <li>
              <Link
                to="/Terminos"
                className="block px-2 py-1 hover:underline hover:bg-slate-800 rounded"
              >
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link
                to="/Privacity"
                className="block px-2 py-1 hover:underline hover:bg-slate-800 rounded"
              >
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link
                to="/AboutMe"
                className="block px-2 py-1 hover:underline hover:bg-slate-800 rounded"
              >
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link
                to="/FAQ"
                className="block px-2 py-1 hover:underline hover:bg-slate-800 rounded"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <hr className="my-6 border-slate-700" />

        <div className="text-center">
          <span className="block text-sm text-gray-400">
            © 2026 Cutzy Cinema. Todos los derechos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}
