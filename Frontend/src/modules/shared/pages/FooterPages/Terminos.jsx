import { useState } from 'react';
import { Card } from 'flowbite-react';

function Terminos() {
  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (panelIndex) => {
    setOpenPanel(openPanel === panelIndex ? null : panelIndex);
  };

  const terms = [
    {
      id: 1,
      title: 'Uso de la Plataforma',
      content: (
        <div>
          <p className="text-gray-300">
            Cutzy Cinema te permite reservar entradas, seleccionar asientos y acceder a información
            sobre películas y funciones. El uso indebido, como intentos de fraude o acceso no
            autorizado, resultará en la suspensión de tu cuenta.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Reservas y Pagos',
      content: (
        <div>
          <p className="text-gray-300">
            Todas las reservas están sujetas a disponibilidad. Los pagos se procesan de forma segura
            a través de <span className="font-semibold text-blue-400">Mercado Pago</span>. No
            compartas tus datos de pago con terceros. Cutzy Cinema no se responsabiliza por errores
            en la información proporcionada por el usuario.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Cancelaciones y Reembolsos',
      content: (
        <div>
          <p className="text-gray-300">
            Las cancelaciones de reservas deben realizarse con al menos{' '}
            <span className="font-semibold text-purple-400">2 horas de anticipación</span> a la hora
            de la función para ser procesadas. Para solicitar reembolsos o reportar problemas con el
            pago, contáctanos en{' '}
            <a href="mailto:cutzycinema@gmail.com" className="text-purple-400 underline">
              cutzycinema@gmail.com
            </a>
            .
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Privacidad y Seguridad',
      content: (
        <div>
          <p className="text-gray-300">
            Protegemos tus datos personales conforme a nuestra{' '}
            <a href="/privacity" className="text-purple-400 underline">
              Política de Privacidad
            </a>
            . No compartimos tu información con terceros sin tu consentimiento.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Modificaciones de los Términos',
      content: (
        <div>
          <p className="text-gray-300">
            Cutzy Cinema puede actualizar estos términos en cualquier momento. Te notificaremos
            sobre cambios importantes a través de la plataforma o por correo electrónico.
          </p>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Contacto',
      content: (
        <div>
          <p className="text-gray-300">
            Si tienes preguntas sobre estos términos, escríbenos a{' '}
            <a href="mailto:cutzycinema@gmail.com" className="text-purple-400 underline">
              cutzycinema@gmail.com
            </a>
            .
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-slate-800/70 shadow-2xl border-0 py-8 px-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-purple-200 mb-2 text-center">
            Términos y Condiciones
          </h1>
          <p className="text-gray-300 text-center mb-4">
            Bienvenido a <span className="font-semibold text-purple-400">Cutzy Cinema</span>. Al
            utilizar nuestra plataforma, aceptas los siguientes términos y condiciones. Por favor,
            léelos atentamente.
          </p>
          <div className="space-y-3 w-full">
            {terms.map((term) => (
              <div
                key={term.id}
                className="border border-slate-600 rounded-lg overflow-hidden bg-slate-800/30 backdrop-blur-sm"
              >
                <button
                  onClick={() => togglePanel(term.id)}
                  className="w-full px-6 py-4 text-left bg-slate-800 hover:bg-slate-700 text-white font-medium flex justify-between items-center transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                >
                  <span className="text-lg">{`${term.id}. ${term.title}`}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-200 text-purple-400 ${
                      openPanel === term.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openPanel === term.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-4 bg-slate-800/50">{term.content}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center">
            Última actualización: Febrero 2026 &mdash; Cutzy Cinema
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Terminos;
