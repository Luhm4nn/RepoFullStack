import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import {
  confirm as confirmReservaRepo,
  getOne as getReservaRepo,
} from '../Funciones/reservas.repository.js';
import { getReservaWithDetails } from '../Funciones/qr.repository.js';
import { sendReservaConfirmationEmail } from '../utils/mailer.js';
import logger from '../utils/logger.js';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

/**
 * Crea una preferencia de pago en Mercado Pago
 */
export const createPaymentPreference = async (req, res) => {
  const { reserva, asientos } = req.body;

  try {
    // Validar integridad antes de crear la preferencia
    const reservaDB = await getReservaRepo({
      idSala: reserva.idSala,
      fechaHoraFuncion: reserva.fechaHoraFuncion,
      DNI: reserva.DNI,
      fechaHoraReserva: reserva.fechaHoraReserva,
    });

    if (!reservaDB || reservaDB.estado !== 'PENDIENTE') {
      return res.status(400).json({ error: 'La reserva ya no está disponible para pago.' });
    }

    const preference = new Preference(client);

    const body = {
      items: [
        {
          title: `Reserva - ${reserva.nombrePelicula}`,
          description: `Función: ${reserva.fecha} ${reserva.hora} - ${reserva.sala}`,
          quantity: 1,
          unit_price: parseFloat(reserva.total),
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/reserva/success`,
        failure: `${process.env.FRONTEND_URL}/reserva/failure`,
        pending: `${process.env.FRONTEND_URL}/reserva/pending`,
      },
      notification_url: `${process.env.BACKEND_URL}/mercadopago/webhooks`,
      metadata: {
        id_sala: reserva.idSala.toString(),
        fecha_hora_funcion: reserva.fechaHoraFuncion,
        dni: reserva.DNI.toString(),
        fecha_hora_reserva: reserva.fechaHoraReserva,
      },
    };

    const response = await preference.create({ body });
    return res.json({ id: response.id });
  } catch (error) {
    logger.error('Error creando preferencia:', error);
    return res.status(500).json({ error: 'Error al procesar el pago' });
  }
};

/**
 * Webhook para notificaciones de pago
 */
export const handleWebhook = async (req, res) => {
  const { type, data } = req.body;

  try {
    if (type === 'payment') {
      const payment = new Payment(client);
      const result = await payment.get({ id: data.id });

      if (result.status === 'approved') {
        const { metadata } = result;
        const subParams = {
          idSala: parseInt(metadata.id_sala, 10),
          fechaHoraFuncion: metadata.fecha_hora_funcion,
          DNI: parseInt(metadata.dni, 10),
          fechaHoraReserva: metadata.fecha_hora_reserva,
        };

        const reservaDB = await getReservaRepo(subParams);

        if (reservaDB && reservaDB.estado === 'PENDIENTE') {
          // Confirmar solo si el monto coincide
          if (
            Math.abs(parseFloat(result.transaction_amount) - parseFloat(reservaDB.total)) < 0.01
          ) {
            await confirmReservaRepo(subParams);
            logger.info('Pago aprobado. Reserva confirmada:', subParams);

            // Enviar email de confirmación
            try {
              const reservaConDetalles = await getReservaWithDetails(subParams);

              if (reservaConDetalles) {
                // Obtener asientos de la reserva (desde asiento_reserva)
                const asientos = (reservaConDetalles.asiento_reserva || []).map((ar) => ({
                  filaAsiento: ar.asiento.filaAsiento,
                  nroAsiento: ar.asiento.nroAsiento,
                }));

                // Formatear fecha y hora
                const fechaHora = new Date(reservaConDetalles.fechaHoraFuncion);
                const fechaFormato = fechaHora.toLocaleDateString('es-AR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
                const horaFormato = fechaHora.toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                // Datos para el email
                const emailData = {
                  email: reservaConDetalles.usuario?.email,
                  nombreUsuario: `${reservaConDetalles.usuario?.nombreUsuario} ${reservaConDetalles.usuario?.apellidoUsuario}`,
                  nombrePelicula:
                    reservaConDetalles.funcion?.pelicula?.nombrePelicula || 'Película',
                  nombreSala: reservaConDetalles.funcion?.sala?.nombreSala || 'Sala',
                  fechaHora: `${fechaFormato} a las ${horaFormato}`,
                  asientos,
                  total: reservaConDetalles.total,
                  reservaParams: subParams, // Pasar los parámetros para generar el QR
                };

                await sendReservaConfirmationEmail(emailData);
                logger.info('Email de confirmación enviado para:', subParams.DNI);
              }
            } catch (emailError) {
              logger.error('Error enviando email de confirmación:', emailError);
              // No lanzar error aquí, la reserva ya está confirmada
            }
          } else {
            logger.error(
              'Mismatch de monto en el pago:',
              result.transaction_amount,
              reservaDB.total
            );
          }
        } else {
          logger.warn('Intento de confirmar reserva inexistente o ya procesada:', subParams);
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    logger.error('Error en webhook de Mercado Pago:', error.message);
    res.sendStatus(500);
  }
};
