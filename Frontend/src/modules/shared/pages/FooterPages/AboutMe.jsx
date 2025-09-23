import { Card } from "flowbite-react";
import cutzyLogo from "../../../../assets/cutzy-logo-blanco.png";

function AboutMe() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center  p-6">
      <Card className="max-w-2xl w-full bg-slate-800/80 shadow-2xl border-0">
        <div className="flex flex-col items-center gap-4">
        <div className="shadow-[0_0_24px_0_theme(colors.purple.700)] w-32 h-32 rounded-full  border-4 border-purple-700 bg-slate-900 mb-2 flex items-center justify-center p-3">
          <img
            src={cutzyLogo}
            alt="Cutzy Cinema Logo"
            className="object-contain w-full h-full"
          />
        </div>
          <h1 className="text-3xl font-bold text-purple-200 mb-2 text-center">
            Sobre Nosotros
          </h1>
          <p className="text-lg text-gray-300 text-center">
            <span className="font-semibold text-purple-400">Cutzy Cinema</span> nació de la pasión por el cine y la tecnología. Somos un equipo joven y creativo que busca revolucionar la experiencia de ir al cine en la era digital.
          </p>
          <p className="text-gray-400 text-center">
            Nuestra plataforma te permite descubrir las mejores películas, reservar tus asientos favoritos, y vivir la magia del cine con solo unos clics. Creemos en la comodidad, la innovación y la emoción de compartir historias en la gran pantalla.
          </p>
          <div className="w-full flex flex-col md:flex-row gap-4 mt-4">
              <div className="flex-1 bg-purple-800/60 rounded-lg p-4 text-center">
              <h2 className="text-xl font-semibold text-purple-200 flex items-center justify-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 inline-block align-middle"
                  style={{ marginBottom: 0 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                  />
                </svg>
                <span>Nuestra Misión</span>
              </h2>
              <p className="text-gray-300">
                Hacer que cada función sea inolvidable, conectando a las personas con el cine de una forma moderna, fácil y divertida.
              </p>
            </div>
            <div className="flex-1 bg-blue-900/60 rounded-lg p-4 text-center">
              <h2 className="text-xl font-semibold text-blue-200 flex items-center justify-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 inline-block align-middle"
                  style={{ marginBottom: 0 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  />
                </svg>
                <span>Nuestros Valores</span>
              </h2>
              <ul className="text-gray-300 list-disc list-inside text-left mx-auto max-w-xs">
                <li>Innovación constante</li>
                <li>Pasión por el cine</li>
                <li>Experiencia de usuario</li>
                <li>Comunidad y cercanía</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-purple-300 mb-1">¿Quiénes somos?</h3>
            <p className="text-gray-400">
              Somos cinéfilos, desarrolladores y soñadores. Creemos que el cine une, inspira y transforma. ¡Gracias por ser parte de la familia <span className="text-purple-400 font-bold">Cutzy</span>!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AboutMe;