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

        logger.info('🔍 Webhook aprobado, buscando reserva con:', subParams);
        const reservaDB = await getReservaRepo(subParams);

        if (!reservaDB) {
          logger.error(' RESERVA NO ENCONTRADA en la base de datos con parámetros:', subParams);
          logger.error('Verifica que las fechas coincidan exactamente');
        } else {
          logger.info(' Reserva encontrada:', {
            estado: reservaDB.estado,
            total: reservaDB.total,
            DNI: reservaDB.DNI,
          });
        }

        if (reservaDB && reservaDB.estado === 'PENDIENTE') {
          // Confirmar solo si el monto coincide
          if (
            Math.abs(parseFloat(result.transaction_amount) - parseFloat(reservaDB.total)) < 0.01
          ) {
            await confirmReservaRepo(subParams);
            logger.info(' Pago aprobado. Reserva confirmada:', subParams);

            // Enviar email de confirmación
            try {
              logger.info(' Intentando obtener detalles de reserva para email...');
              const reservaConDetalles = await getReservaWithDetails(subParams);

              if (!reservaConDetalles) {
                logger.error(' ERROR CRÍTICO: getReservaWithDetails devolvió null para:', subParams);
                throw new Error('No se pudieron obtener los detalles de la reserva');
              }

              logger.info(' Detalles de reserva obtenidos:', {
                hasUsuario: !!reservaConDetalles.usuario,
                hasEmail: !!reservaConDetalles.usuario?.email,
                hasFuncion: !!reservaConDetalles.funcion,
                hasPelicula: !!reservaConDetalles.funcion?.pelicula,
                hasSala: !!reservaConDetalles.funcion?.sala,
                numAsientos: reservaConDetalles.asiento_reserva?.length || 0,
              });

              // Validar datos críticos antes de enviar email
              if (!reservaConDetalles.usuario?.email) {
                logger.error(' ERROR: Usuario sin email:', reservaConDetalles.usuario);
                throw new Error('El usuario no tiene email registrado');
              }

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
                email: reservaConDetalles.usuario.email,
                nombreUsuario: `${reservaConDetalles.usuario?.nombreUsuario} ${reservaConDetalles.usuario?.apellidoUsuario}`,
                nombrePelicula:
                  reservaConDetalles.funcion?.pelicula?.nombrePelicula || 'Película',
                nombreSala: reservaConDetalles.funcion?.sala?.nombreSala || 'Sala',
                fechaHora: `${fechaFormato} a las ${horaFormato}`,
                asientos,
                total: reservaConDetalles.total,
                reservaParams: subParams, // Pasar los parámetros para generar el QR
              };

              logger.info(' Preparando envío de email a:', emailData.email);
              await sendReservaConfirmationEmail(emailData);
              logger.info(' Email de confirmación enviado exitosamente para DNI:', subParams.DNI);
            } catch (emailError) {
              logger.error(' ERROR ENVIANDO EMAIL DE CONFIRMACIÓN:', {
                message: emailError.message,
                stack: emailError.stack,
                subParams,
              });
              // No lanzar error aquí, la reserva ya está confirmada
            }
          } else {
            logger.error(' Mismatch de monto en el pago:', {
              montoMP: result.transaction_amount,
              montoDB: reservaDB.total,
              diferencia: Math.abs(parseFloat(result.transaction_amount) - parseFloat(reservaDB.total)),
            });
          }
        } else if (reservaDB && reservaDB.estado !== 'PENDIENTE') {
          logger.warn(' Reserva encontrada pero YA NO está PENDIENTE:', {
            estado: reservaDB.estado,
            subParams,
            mensaje: 'Posible webhook duplicado de Mercado Pago',
          });
        } else {
          logger.warn(' Intento de confirmar reserva inexistente:', subParams);
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    logger.error('Error en webhook de Mercado Pago:', error.message);
    res.sendStatus(500);
  }
};
