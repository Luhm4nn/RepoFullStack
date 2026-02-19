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
    notification_url: `${(process.env.BACKEND_URL || process.env.NGROK_URL).replace(/\/+$/, '')}/api/mercadopago/webhooks`,
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
  logger.info('>>> WEBHOOK MP RECIBIDO:', { type, data });

  if (type === 'payment') {
    const payment = new Payment(client);
    const result = await payment.get({ id: data.id });
    logger.info('>>> RESULTADO PAGO MP GET:', { status: result.status, id: data.id });

    if (result.status === 'approved') {
      const { metadata } = result;
      const subParams = {
        idSala: parseInt(metadata.id_sala, 10),
        fechaHoraFuncion: metadata.fecha_hora_funcion,
        DNI: parseInt(metadata.dni, 10),
        fechaHoraReserva: metadata.fecha_hora_reserva,
      };

      logger.info('>>> PARAMETROS EXTRAIDOS PARA BUSQUEDA:', subParams);

      const reservaDB = await getReservaRepo(subParams);

      if (!reservaDB) {
        logger.error('>>> ERROR: Reserva NO encontrada en DB con params:', subParams);
        return res.sendStatus(200);
      }

      logger.info('>>> RESERVA ENCONTRADA EN DB:', { estado: reservaDB.status });

      const montoMP = parseFloat(result.transaction_amount);
      const montoDB = parseFloat(reservaDB.total);

      if (Math.abs(montoMP - montoDB) > 0.01) {
        logger.error('>>> ERROR: Mismatch de monto:', { montoMP, montoDB });
        return res.sendStatus(200);
      }

      if (reservaDB.estado === ESTADOS_RESERVA.PENDIENTE) {
        await confirmReservaRepo(subParams);
        logger.info('>>> Pago aprobado. Reserva confirmada OK.');
      } else if (reservaDB.estado === ESTADOS_RESERVA.ACTIVA) {
        logger.info('>>> Webhook duplicado: Reserva ya estaba confirmada.');
      } else {
        logger.warn('>>> ADVERTENCIA: Reserva en estado inesperado:', {
          estado: reservaDB.estado,
          subParams,
        });
        return res.sendStatus(200);
      }

      // Enviar email de confirmación
      logger.info('>>> DISPARANDO envio de email...');
      try {
        const reservaConDetalles = await getReservaWithDetails(subParams);

        if (!reservaConDetalles) {
          logger.error('>>> FALLO: No se encontraron detalles para el email.', subParams);
          throw new Error('No se pudieron obtener los detalles de la reserva');
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

        const mailResult = await sendReservaConfirmationEmail(emailData);
        logger.info('>>> RESULTADO PROCESO MAILER:', { success: mailResult, DNI: subParams.DNI });
      } catch (emailError) {
        logger.error('>>> ERROR CRITICO AL ENVIAR EMAIL:', emailError.message);
      }
    } else {
      logger.info('>>> PAGO NO APROBADO TODAVIA:', { status: result.status });
    }
  }
  res.sendStatus(200);
});
