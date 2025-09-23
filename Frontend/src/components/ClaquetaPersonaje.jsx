import { useEffect, useState } from "react";

// Personaje: Claqueta con ojos, piernas y bocadillo animado
export default function ClaquetaPersonaje() {
  const [mensajeIdx, setMensajeIdx] = useState(0);
  const mensajes = [
    "¡Hola! Soy Cutzy! 🎬",
    "¿Listo para ver una peli?",
    "Haz click en 'Ver Cartelera' para empezar!",
    "¡Disfruta la función! 🍿"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMensajeIdx((idx) => (idx + 1) % mensajes.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, [mensajeIdx]);

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-center select-none">
      {/* Bocadillo */}
      <div className="mb-2 relative animate-fade-in-up">
        <div className="bg-white text-gray-900 rounded-2xl px-6 py-3 shadow-lg text-lg font-semibold border-2 border-gray-300 relative">
          {mensajes[mensajeIdx]}
          <span className="absolute left-8 -bottom-4 w-6 h-6 bg-white border-l-2 border-b-2 border-gray-300 rotate-45"></span>
        </div>
      </div>
      {/* Claqueta SVG con ojos y piernas */}
      <div className="relative animate-bounce-slow">
        <svg width="90" height="100" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Claqueta base */}
          <rect x="10" y="30" width="70" height="40" rx="8" fill="#fff" stroke="#222" strokeWidth="3"/>
          {/* Claqueta tapa */}
          <rect x="10" y="18" width="70" height="18" rx="4" fill="#222" stroke="#222" strokeWidth="2"/>
          {/* Rayas */}
          <rect x="15" y="20" width="10" height="14" rx="2" fill="#fff"/>
          <rect x="35" y="20" width="10" height="14" rx="2" fill="#fff"/>
          <rect x="55" y="20" width="10" height="14" rx="2" fill="#fff"/>
          {/* Ojos */}
          <ellipse cx="30" cy="50" rx="6" ry="8" fill="#fff" stroke="#222" strokeWidth="2"/>
          <ellipse cx="60" cy="50" rx="6" ry="8" fill="#fff" stroke="#222" strokeWidth="2"/>
          <ellipse cx="30" cy="53" rx="2.5" ry="3.5" fill="#222"/>
          <ellipse cx="60" cy="53" rx="2.5" ry="3.5" fill="#222"/>
          {/* Piernas */}
          <rect x="28" y="70" width="4" height="18" rx="2" fill="#222"/>
          <rect x="58" y="70" width="4" height="18" rx="2" fill="#222"/>
          {/* Zapatos */}
          <ellipse cx="30" cy="90" rx="5" ry="3" fill="#444"/>
          <ellipse cx="60" cy="90" rx="5" ry="3" fill="#444"/>
        </svg>
      </div>
    </div>
  );
}

// Animaciones Tailwind personalizadas (agregar en tailwind.config.js):
// 'fade-in-up': 'fadeInUp 0.7s',
// 'bounce-slow': 'bounce 2.5s infinite',
// @keyframes fadeInUp { from { opacity:0; transform: translateY(20px);} to {opacity:1; transform: none;} }
