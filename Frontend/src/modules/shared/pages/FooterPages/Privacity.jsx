import {
  Card,
  Timeline,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTitle,
  TimelineTime,
} from 'flowbite-react';

function Privacity() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-slate-800/80 shadow-2xl border-0 py-8 px-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-purple-200 mb-2 text-center">
            Política de Privacidad
          </h1>
          <p className="text-gray-300 text-center mb-4">
            En <span className="font-semibold text-purple-400">Cutzy Cinema</span> tu privacidad es
            nuestra prioridad. Queremos que disfrutes de la magia del cine con total confianza y
            transparencia.
          </p>
          <Timeline className="w-full">
            <TimelineItem>
              <TimelinePoint className="bg-purple-700" />
              <TimelineContent className="bg-purple-800/70 p-4 rounded-lg">
                <TimelineTime className="text-purple-300">Recopilación de datos</TimelineTime>
                <TimelineTitle className="text-white">¿Qué información recolectamos?</TimelineTitle>
                <TimelineBody className="text-gray-300">
                  Recopilamos datos como nombre, correo electrónico y preferencias de películas. Los
                  detalles de pago son gestionados de forma segura por{' '}
                  <span className="font-semibold text-blue-400">Mercado Pago</span>; nosotros no
                  almacenamos los datos de tus tarjetas.
                </TimelineBody>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelinePoint className="bg-purple-700" />
              <TimelineContent className="bg-purple-800/70 p-4 rounded-lg">
                <TimelineTime className="text-purple-300">Uso de la información</TimelineTime>
                <TimelineTitle className="text-white">¿Para qué usamos tus datos?</TimelineTitle>
                <TimelineBody className="text-gray-300">
                  Utilizamos tu información para gestionar reservas, personalizar tu experiencia,
                  enviarte novedades y mejorar nuestros servicios. Nunca vendemos tus datos a
                  terceros.
                </TimelineBody>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelinePoint className="bg-purple-700" />
              <TimelineContent className="bg-purple-800/70 p-4 rounded-lg">
                <TimelineTime className="text-purple-300">Seguridad</TimelineTime>
                <TimelineTitle className="text-white">¿Cómo protegemos tus datos?</TimelineTitle>
                <TimelineBody className="text-gray-300">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger tu
                  información contra accesos no autorizados, pérdidas o alteraciones.
                </TimelineBody>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelinePoint className="bg-purple-700" />
              <TimelineContent className="bg-purple-800/70 p-4 rounded-lg">
                <TimelineTime className="text-purple-300">Tus derechos</TimelineTime>
                <TimelineTitle className="text-white">Control y transparencia</TimelineTitle>
                <TimelineBody className="text-gray-300">
                  Puedes acceder, modificar o eliminar tus datos personales en cualquier momento
                  desde tu perfil o contactándonos. Respetamos tu derecho a la privacidad.
                </TimelineBody>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelinePoint className="bg-purple-700" />
              <TimelineContent className="bg-purple-800/70 p-4 rounded-lg">
                <TimelineTime className="text-purple-300">Contacto</TimelineTime>
                <TimelineTitle className="text-white">¿Tienes dudas?</TimelineTitle>
                <TimelineBody className="text-gray-300">
                  Si tienes preguntas sobre nuestra política de privacidad, escríbenos a{' '}
                  <a href="mailto:cutzycinema@gmail.com" className="text-purple-400 underline">
                    cutzycinema@gmail.com
                  </a>
                  .
                </TimelineBody>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
          <p className="text-xs text-gray-500 mt-6 text-center">
            Última actualización: Febrero 2026 &mdash; Cutzy Cinema
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Privacity;
