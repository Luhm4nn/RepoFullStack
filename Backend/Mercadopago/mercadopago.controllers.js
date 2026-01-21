import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import {
  confirm as confirmReservaRepo,
  getOne as getReservaRepo,
} from '../Funciones/reservas.repository.js';
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
