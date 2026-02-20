import { useState } from 'react';
import { Card } from 'flowbite-react';

function FAQ() {
  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (panelIndex) => {
    setOpenPanel(openPanel === panelIndex ? null : panelIndex);
  };

  const faqs = [
    {
      id: 1,
      title: '¿Qué es Cutzy Cinema?',
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Cutzy Cinema es una plataforma moderna para la gestión y reserva de entradas de cine.
            Ofrecemos una experiencia completa para ver las últimas películas con la mejor calidad.
          </p>
          <p className="text-gray-300">
            Puedes explorar nuestra cartelera, reservar asientos y disfrutar de una experiencia
            cinematográfica única.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: '¿Cómo puedo reservar mis entradas?',
      content: (
        <div>
          <p className="mb-2 text-gray-300">Reservar tus entradas es muy fácil y rápido:</p>
          <ol className="list-decimal list-inside text-gray-300 space-y-1">
            <li>Navega por nuestra cartelera y selecciona la película.</li>
            <li>Elige el día y el horario de la función.</li>
            <li>Selecciona tus asientos en el mapa interactivo de la sala.</li>
            <li>
              Completa el pago de forma segura a través de{' '}
              <span className="font-semibold text-blue-400">Mercado Pago</span>.
            </li>
            <li>Tu reserva aparecerá en tu perfil con un código QR para el ingreso.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 3,
      title: '¿Puedo elegir mis asientos?',
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            ¡Por supuesto! Nuestro sistema de reservas permite elegir tus asientos exactos:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Visualiza la disposición real de la sala.</li>
            <li>
              Los asientos en <span className="text-purple-400">Púrpura</span> son tus
              seleccionados.
            </li>
            <li>
              Los asientos en <span className="text-gray-500">Gris</span> ya están ocupados.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 4,
      title: '¿Qué métodos de pago aceptan?',
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Utilizamos la pasarela de{' '}
            <span className="font-semibold text-blue-400">Mercado Pago</span>, lo que te permite
            pagar con:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Tarjetas de Crédito y Débito.</li>
            <li>Dinero en cuenta de Mercado Pago.</li>
            <li>Otros medios disponibles en la plataforma de pago (Rapipago, Pago Fácil, etc).</li>
          </ul>
        </div>
      ),
    },
    {
      id: 5,
      title: '¿Puedo cancelar o pedir un reembolso?',
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Sí, puedes cancelar tu reserva desde la sección "Mis Reservas" en tu perfil, siempre que
            falten al menos <span className="font-semibold text-purple-400">2 horas</span> para el
            inicio de la función.
          </p>
          <p className="text-gray-300">
            Para solicitar reembolsos por problemas técnicos, envíanos un correo a{' '}
            <a href="mailto:cutzycinema@gmail.com" className="text-purple-400 underline">
              cutzycinema@gmail.com
            </a>{' '}
            adjuntando tu comprobante.
          </p>
        </div>
      ),
    },
    {
      id: 6,
      title: '¿Cómo ingreso a la sala?',
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Una vez Confirmado el pago, tu entrada tendrá un código QR único.
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Presenta el código QR desde tu celular en la entrada.</li>
            <li>Nuestro personal lo escaneará para validar tu ingreso.</li>
            <li>No es necesario imprimir la entrada, cuidamos el medio ambiente.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 7,
      title: '¿Cómo contacto con soporte?',
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Si tienes algún inconveniente con tu reserva o el sitio:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>
              Email:{' '}
              <a href="mailto:cutzycinema@gmail.com" className="text-purple-400 underline">
                cutzycinema@gmail.com
              </a>
            </li>
            <li>Atención: Lunes a Domingo de 09:00 a 00:00 hs.</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-slate-800/70 shadow-2xl border-0 py-8 px-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-purple-200 mb-2 text-center">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-300 text-center mb-4">
            Aquí encontrarás respuestas a las dudas más comunes sobre{' '}
            <span className="font-semibold text-purple-400">Cutzy Cinema</span> y el proceso de
            reserva.
          </p>
          <div className="space-y-3 w-full">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-slate-600 rounded-lg overflow-hidden bg-slate-800/30 backdrop-blur-sm"
              >
                <button
                  onClick={() => togglePanel(faq.id)}
                  className="w-full px-6 py-4 text-left bg-slate-800 hover:bg-slate-700 text-white font-medium flex justify-between items-center transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                >
                  <span className="text-lg">{faq.title}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-200 text-purple-400 ${
                      openPanel === faq.id ? 'rotate-180' : ''
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
                    openPanel === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-4 bg-slate-800/50">{faq.content}</div>
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

export default FAQ;
