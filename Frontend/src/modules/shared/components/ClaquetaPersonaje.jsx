import { useEffect, useState } from "react";

export function ClaquetaPersonaje({
  fixed = true,               // si true: position fixed bottom-left; si false: render inline
  position = "bottom-left",   // 'bottom-left' (por ahora solo ese), reservado para futuras posiciones
  messageInterval = 7000,     // ms entre mensajes (más espaciado por defecto)
  size = 90,                  // ancho del SVG en px (alto se calcula)
  mensajes = [
    "¡Hola! Soy Cutzy! 🎬",
    "¿Listo para ver una peli?",
    "Haz click en 'Ver Cartelera' para empezar!",
    "¡Disfruta la función! 🍿"
  ],
  className = ""              // clases adicionales para el contenedor (útil al integrarlo)
}) {
  const [mensajeIdx, setMensajeIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMensajeIdx((idx) => (idx + 1) % mensajes.length);
    }, messageInterval);
    return () => clearInterval(id);
  }, [messageInterval, mensajes.length]);

  const containerClass = fixed
    ? "fixed bottom-8 left-8 z-50"
    : "relative";

  // tamaño: width=size, height ≈ size * 1.11 para mantener proporción similar al original
  const width = size;
  const height = Math.round(size * 1.11);

  return (
    <div className={`${containerClass} ${className}`} aria-live="polite">
      {/* Bocadillo: solo fade (no jump) */}
      <div className="mb-2">
        <div
          key={mensajeIdx}
          className="bg-white text-gray-900 rounded-2xl px-5 py-2 shadow-lg text-base font-semibold border-2 border-gray-300 relative transition-opacity duration-500"
          style={{ opacity: 1 }}
        >
          {mensajes[mensajeIdx]}
          <span className="absolute left-6 -bottom-4 w-6 h-6 bg-white border-l-2 border-b-2 border-gray-300 rotate-45" />
        </div>
      </div>

      {/* Claqueta SVG (sin animación de entrada para evitar saltos), puedes agregar bob si querés */}
      <div>
        <svg
          width={width}
          height={height}
          viewBox="0 0 90 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Claqueta Cutzy"
        >
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

export default ClaquetaPersonaje;