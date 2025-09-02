import { useState } from "react";
import { Card } from "flowbite-react";

function FAQ() {
  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (panelIndex) => {
    setOpenPanel(openPanel === panelIndex ? null : panelIndex);
  };

  const faqs = [
    {
      id: 1,
      title: "¿Qué es Cutzy Cinema?",
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Cutzy Cinema es una plataforma moderna para la gestión y reserva de entradas de cine. 
            Ofrecemos una experiencia completa para ver las últimas películas con la mejor calidad.
          </p>
          <p className="text-gray-300">
            Puedes explorar nuestra cartelera, reservar asientos y disfrutar de una experiencia cinematográfica única.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "¿Cómo puedo reservar mis entradas?",
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Reservar tus entradas es muy fácil:
          </p>
          <ol className="list-decimal list-inside text-gray-300 space-y-1">
            <li>Selecciona la película que quieres ver</li>
            <li>Elige el horario y el día</li>
            <li>Selecciona tus asientos preferidos</li>
            <li>Completa el proceso de pago</li>
            <li>¡Recibe tu confirmación y disfruta!</li>
          </ol>
        </div>
      )
    },
    {
      id: 3,
      title: "¿Puedo elegir mis asientos?",
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            ¡Por supuesto! Nuestro sistema de reservas incluye un selector de asientos interactivo donde puedes:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Ver la disposición completa de la sala</li>
            <li>Seleccionar tus asientos preferidos</li>
            <li>Ver qué asientos están disponibles u ocupados</li>
            <li>Elegir asientos VIP con mayor comodidad</li>
          </ul>
        </div>
      )
    },
    {
      id: 4,
      title: "¿Qué métodos de pago aceptan?",
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Aceptamos múltiples métodos de pago para tu comodidad:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Tarjetas de crédito (Visa, Mastercard, American Express)</li>
            <li>Tarjetas de débito</li>
            <li>Pagos digitales (PayPal, Apple Pay, Google Pay)</li>
            <li>Transferencias bancarias</li>
          </ul>
        </div>
      )
    },
    {
      id: 5,
      title: "¿Con qué anticipación debo llegar?",
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Recomendamos llegar al menos 15-20 minutos antes del inicio de la función para:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Ingresar a la sala con tu código QR</li>
            <li>Comprar snacks y bebidas</li>
            <li>Encontrar tus asientos cómodamente</li>
            <li>Disfrutar de los trailers y anuncios</li>
          </ul>
        </div>
      )
    },
    {
      id: 6,
      title: "¿Cómo puedo contactar con soporte?",
      content: (
        <div>
          <p className="mb-2 text-gray-300">
            Estamos aquí para ayudarte. Puedes contactarnos a través de:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Email: soporte@cutzycinema.com</li>
            <li>Teléfono: +1 (555) 123-4567</li>
            <li>Chat en vivo en nuestra página web</li>
            <li>Horario: Lunes a Domingo, 9:00 AM - 11:00 PM</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-slate-800/70 shadow-2xl border-0 py-8 px-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-purple-200 mb-2 text-center">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-300 text-center mb-4">
            Aquí encontrarás respuestas a las dudas más comunes sobre <span className="font-semibold text-purple-400">Cutzy Cinema</span> y el proceso de reserva.
          </p>
          <div className="space-y-3 w-full">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-slate-600 rounded-lg overflow-hidden bg-slate-800/30 backdrop-blur-sm">
                <button
                  onClick={() => togglePanel(faq.id)}
                  className="w-full px-6 py-4 text-left bg-slate-800 hover:bg-slate-700 text-white font-medium flex justify-between items-center transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                >
                  <span className="text-lg">{faq.title}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-200 text-purple-400 ${
                      openPanel === faq.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openPanel === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-4 bg-slate-800/50">{faq.content}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center">
            Última actualización: Agosto 2025 &mdash; Cutzy Cinema
          </p>
        </div>
      </Card>
    </div>
  );
}

export default FAQ;