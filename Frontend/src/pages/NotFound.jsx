import { Link, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

function NotFound() {
  const navigate = useNavigate();

  // Genera posiciones y velocidades para las estrellas
  const stars = Array.from({ length: 50 }).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 4,
    size: 1 + Math.random() * 2,
    opacity: 0.5 + Math.random() * 0.5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: "white",
              opacity: star.opacity,
              animation: `starfall ${star.duration}s linear ${star.delay}s infinite`,
            }}
          />
        ))}
        {/* CSS para animar las estrellas */}
        <style>
          {`
            @keyframes starfall {
              0% { transform: translateY(0); }
              100% { transform: translateY(100vh); }
            }
          `}
        </style>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Death Star */}
          <div className="mb-8 sm:mb-12 flex justify-center">
            <div className="relative">
              {/* Death Star body */}
              <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-2xl flex items-center justify-center animate-spin-slow hover:scale-110 transition-transform duration-500">
                {/* Death Star "equator" line */}
                <div className="absolute left-0 right-0 top-1/2 h-2 sm:h-3 md:h-4 bg-gray-500/60 rounded-full" style={{ transform: "translateY(-50%)" }} />
                {/* Death Star details */}
                <div className="absolute left-1/4 top-1/3 w-6 h-2 sm:w-10 sm:h-3 md:w-14 md:h-4 bg-gray-500/80 rounded-lg rotate-12" />
                {/* Rotating red eye */}
                <div className="absolute"
                  style={{
                    left: "70%",
                    top: "22%",
                    width: "18%",
                    height: "18%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gray-700 border-2 border-gray-400 flex items-center justify-center">
                      <div
                        className="absolute left-1/2 top-1/2"
                        style={{
                          width: "60%",
                          height: "60%",
                          transform: "translate(-50%, -50%)",
                          animation: "rotate-eye 2s linear infinite",
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/50 border-2 border-red-800"></div>
                        <div className="absolute left-1/2 top-1/2 w-1 h-1 bg-white rounded-full" style={{ transform: "translate(-50%, -50%)" }}></div>
                      </div>
                    </div>
                  </div>
                  <style>
                    {`
                      @keyframes rotate-eye {
                        0% { transform: translate(-50%, -50%) rotate(0deg);}
                        100% { transform: translate(-50%, -50%) rotate(360deg);}
                      }
                    `}
                  </style>
                </div>
                {/* Shading */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Purple glow */}
              <div className="absolute -inset-4 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
            </div>
          </div>

          {/* 404 Title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-4 animate-pulse">
              404
            </h1>
            <div className="text-xl sm:text-2xl md:text-3xl text-yellow-400 font-semibold mb-2 animate-fade-in-up">
              These aren't the pages you're looking for
            </div>
            <p className="pb-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in-up-delay">
              La página que buscas se ha perdido en una galaxia muy, muy lejana...
            </p>
          </div>

          {/* Droids */}
          <div className="mb-8 sm:mb-12 flex justify-center items-end space-x-8 animate-droids-appear">
            {/* R2-D2 */}
            <div className="relative group flex flex-col items-center">
              {/* Body */}
              <div className="w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-gradient-to-b from-blue-100 to-blue-300 rounded-b-lg border-4 border-blue-700 mx-auto relative flex flex-col items-center">
                {/* Dome */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-6 sm:w-16 sm:h-8 md:w-20 md:h-10 bg-gradient-to-b from-gray-200 to-gray-400 rounded-t-full border-4 border-blue-700 flex items-center justify-center">
                  {/* Blue panel */}
                  <div className="absolute left-1/2 top-2 transform -translate-x-1/2 w-4 h-2 bg-blue-700 rounded"></div>
                  {/* Red eye */}
                  <div className="absolute left-2 top-2 w-3 h-3 bg-red-500 rounded-full border-1 border-gray-800"></div>
                  {/* Silver eye */}
                  <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-gray-300 rounded-full border"></div>
                  {/* Dome details */}
                  <div className="absolute left-1/2 bottom-1 transform -translate-x-1/2 w-6 h-1 bg-blue-400 rounded"></div>
                </div>
                {/* Body panels */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-md border-2 border-blue-700"></div>
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-blue-700 rounded"></div>
                {/* Vertical lines */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-blue-400 rounded"></div>
                <div className="absolute top-8 left-1/3 w-1 h-6 bg-blue-200 rounded"></div>
                <div className="absolute top-8 right-1/3 w-1 h-6 bg-blue-200 rounded"></div>
                {/* Legs */}
                <div className="absolute -left-3 bottom-0 w-3 h-8 bg-gray-300 rounded-lg border-2 border-blue-700"></div>
                <div className="absolute -right-3 bottom-0 w-3 h-8 bg-gray-300 rounded-lg border-2 border-blue-700"></div>
                {/* Feet */}
                <div className="absolute -left-3 bottom-0 w-3 h-2 bg-yellow-400 rounded-b"></div>
                <div className="absolute -right-3 bottom-0 w-3 h-2 bg-yellow-400 rounded-b"></div>
              </div>
              {/* Dialogo más abajo */}
              <div className="mt-8 sm:mt-10">
                <div className="text-xs sm:text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">
                  *BEEP BOOP*
                </div>
              </div>
            </div>

            {/* C-3PO */}
            <div className="relative group flex flex-col items-center">
              {/* Body */}
              <div className="w-10 h-20 sm:w-12 sm:h-24 md:w-14 md:h-28 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-xl border-4 border-yellow-500 mx-auto relative flex flex-col items-center">
                {/* Head */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-full border-4 border-yellow-500 flex items-center justify-center">
                  {/* Eyes */}
                  <div className="absolute left-1.5 top-3 w-2 h-2 bg-yellow-100 rounded-full border-2 border-yellow-700 shadow-inner"></div>
                  <div className="absolute right-1.5 top-3 w-2 h-2 bg-yellow-100 rounded-full border-2 border-yellow-700 shadow-inner"></div>
                  {/* Brow */}
                  <div className="absolute left-1/2 top-1 transform -translate-x-1/2 w-4 h-1 bg-yellow-600 rounded"></div>
                  {/* Mouth */}
                  <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2 w-3 h-0.5 bg-yellow-700 rounded"></div>
                  {/* Cheek lines */}
                  <div className="absolute left-2 bottom-1 w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <div className="absolute right-2 bottom-1 w-1 h-1 bg-yellow-500 rounded-full"></div>
                </div>
                {/* Neck */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-700 rounded"></div>
                {/* Chest panel */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-yellow-400 rounded border-2 border-yellow-700"></div>
                {/* Abdomen wires */}
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 rounded"></div>
                {/* Arms */}
                <div className="absolute -left-3 top-10 w-3 h-10 bg-yellow-400 rounded-full border-2 border-yellow-700 rotate-12"></div>
                <div className="absolute -right-3 top-10 w-3 h-10 bg-yellow-400 rounded-full border-2 border-yellow-700 -rotate-12"></div>
                {/* Hands */}
                <div className="absolute -left-3 top-20 w-3 h-2 bg-yellow-600 rounded-b"></div>
                <div className="absolute -right-3 top-20 w-3 h-2 bg-yellow-600 rounded-b"></div>
                {/* Legs */}
                <div className="absolute left-2 bottom-0 w-2 h-6 bg-yellow-400 rounded-full border-2 border-yellow-700"></div>
                <div className="absolute right-2 bottom-0 w-2 h-6 bg-yellow-400 rounded-full border-2 border-yellow-700"></div>
                {/* Knees */}
                <div className="absolute left-2 bottom-6 w-2 h-1 bg-yellow-600 rounded"></div>
                <div className="absolute right-2 bottom-6 w-2 h-1 bg-yellow-600 rounded"></div>
                {/* Feet */}
                <div className="absolute left-2 bottom-0 w-2 h-1 bg-yellow-700 rounded-b"></div>
                <div className="absolute right-2 bottom-0 w-2 h-1 bg-yellow-700 rounded-b"></div>
              </div>
              {/* Dialogo más abajo */}
              <div className="mt-8 sm:mt-10">
                <div className="text-xs sm:text-sm text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">
                  *OH MY!*
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full sm:w-auto"
              >
                Volver al Inicio
              </Button>
            </Link>
          </div>

          {/* Yoda Quote */}
          <div className="animate-fade-in-up-delay-2">
            <p className="text-sm sm:text-base text-gray-400 italic max-w-md mx-auto mb-4">
              "Lost a page, you have. Find it, you will not. But return to the cinema, you must."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;