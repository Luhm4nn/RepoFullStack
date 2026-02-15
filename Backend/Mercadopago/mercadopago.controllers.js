import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import {
  confirm as confirmReservaRepo,
  getOne as getReservaRepo,
} from '../Funciones/reservas.repository.js';
import { getReservaWithDetails } from '../Funciones/qr.repository.js';
import { sendReservaConfirmationEmail } from '../utils/mailer.js';
import logger from '../utils/logger.js';
import { ESTADOS_RESERVA } from '../constants/index.js';
import { asyncHandler } from '../Middlewares/asyncHandler.js';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

/**
 * Crea una preferencia de pago en Mercado Pago
 */
export const createPaymentPreference = asyncHandler(async (req, res) => {
  const { reserva } = req.body;

  // Validar integridad antes de crear la preferencia
  const reservaDB = await getReservaRepo({
    idSala: reserva.idSala,
    fechaHoraFuncion: reserva.fechaHoraFuncion,
    DNI: reserva.DNI,
    fechaHoraReserva: reserva.fechaHoraReserva,
  });

  if (!reservaDB || reservaDB.estado !== ESTADOS_RESERVA.PENDIENTE) {
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
});

/**
 * Webhook para notificaciones de pago
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const { type, data } = req.body;

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

      logger.info('Approved webhook from Mercado Pago', { reservationDNI: subParams.DNI });
      const reservaDB = await getReservaRepo(subParams);

      if (!reservaDB) {
        logger.error('Reserva NOT found on DB after webhook payment', subParams);
        return res.sendStatus(200);
      }

      const montoMP = parseFloat(result.transaction_amount);
      const montoDB = parseFloat(reservaDB.total);

      if (Math.abs(montoMP - montoDB) > 0.01) {
        logger.error('Mismatch de monto en el pago:', { montoMP, montoDB });
        return res.sendStatus(200);
      }

      if (reservaDB.estado === ESTADOS_RESERVA.PENDIENTE) {
          await confirmReservaRepo(subParams);
          logger.info('Pago aprobado. Reserva confirmada:', subParams);
        } else if (reservaDB.estado === ESTADOS_RESERVA.ACTIVA) {
          logger.info('Reserva ya estaba ACTIVA (webhook duplicado o ya confirmada)');
        } else {
          logger.warn('Reserva en estado inesperado:', {
            estado: reservaDB.estado,
            subParams,
          });
          return res.sendStatus(200);
        }

        // Enviar email de confirmación
        try {
          const reservaConDetalles = await getReservaWithDetails(subParams);

          if (!reservaConDetalles) {
            throw new Error('No se pudieron obtener los detalles de la reserva');
          }

          if (!reservaConDetalles.usuario?.email) {
            throw new Error('El usuario no tiene email registrado');
          }

          const asientos = (reservaConDetalles.asiento_reserva || []).map((ar) => ({
            filaAsiento: ar.asiento.filaAsiento,
            nroAsiento: ar.asiento.nroAsiento,
          }));

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

          const emailData = {
            email: reservaConDetalles.usuario.email,
            nombreUsuario: `${reservaConDetalles.usuario?.nombreUsuario} ${reservaConDetalles.usuario?.apellidoUsuario}`,
            nombrePelicula: reservaConDetalles.funcion?.pelicula?.nombrePelicula || 'Película',
            nombreSala: reservaConDetalles.funcion?.sala?.nombreSala || 'Sala',
            fechaHora: `${fechaFormato} a las ${horaFormato}`,
            asientos,
            total: reservaConDetalles.total,
            reservaParams: subParams,
          };

          await sendReservaConfirmationEmail(emailData);
          logger.info('Email de confirmación enviado exitosamente', { DNI: subParams.DNI });
        } catch (emailError) {
          logger.error('Error enviando email de confirmación:', emailError.message);
        }
      }
    }
    res.sendStatus(200);
});
