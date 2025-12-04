import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { create as createReserva } from '../Funciones/reservas.repository.js';
import { createMany as createAsientosReservados } from '../Funciones/asientoreservas.repository.js';
import logger from '../utils/logger.js';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

/**
 * Crea una preferencia de pago en Mercado Pago
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const createPaymentPreference = async (req, res) => {
  const { reserva, asientos } = req.body;

  try {
    const preference = new Preference(client);

    const body = {
      items: [
        {
          title: `Reserva - ${reserva.nombrePelicula}`,
          description: `Función: ${reserva.fecha} ${reserva.hora} - ${reserva.sala}`,
          quantity: asientos.length,
          unit_price: parseFloat(reserva.total) / asientos.length,
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/reserva/success`,
        failure: `${process.env.FRONTEND_URL}/reserva/failure`,
        pending: `${process.env.FRONTEND_URL}/reserva/pending`,
      },
      notification_url: `${process.env.NGROK_URL}/mercadopago/webhooks`,
      metadata: {
        id_sala: reserva.idSala.toString(),
        fecha_hora_funcion: reserva.fechaHoraFuncion,
        dni: reserva.DNI.toString(),
        fecha_hora_reserva: reserva.fechaHoraReserva,
        asientos: JSON.stringify(asientos),
      },
    };

    const response = await preference.create({ body });

    return res.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    logger.error('Error creando preferencia de pago:', error);
    return res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
};

/**
 * Webhook para notificaciones de pago
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const handleWebhook = async (req, res) => {
  const { type, data } = req.body;

  try {
    if (type === 'payment') {
      const paymentId = data.id;

      const payment = new Payment(client);
      const result = await payment.get({ id: paymentId });

      logger.info('Webhook recibido:', {
        paymentId: result.id,
        status: result.status,
      });

      if (result.status === 'approved') {
        const metadata = result.metadata;

        // Parsear asientos del metadata
        const asientos = JSON.parse(metadata.asientos);

        // Convertir las fechas a objetos Date y remover milisegundos
        const fechaFuncionDate = new Date(metadata.fecha_hora_funcion);
        fechaFuncionDate.setMilliseconds(0);

        const fechaReservaDate = new Date(metadata.fecha_hora_reserva);
        fechaReservaDate.setMilliseconds(0);

        // Construir reservaData con fechas como Date objects
        const reservaData = {
          idSala: parseInt(metadata.id_sala, 10),
          fechaHoraFuncion: fechaFuncionDate,
          DNI: parseInt(metadata.dni, 10),
          fechaHoraReserva: fechaReservaDate,
          total: parseFloat(result.transaction_amount),
        };

        try {
          const reservaCreada = await createReserva(reservaData);
          logger.info('Reserva creada exitosamente:', { id: reservaCreada.id });

          // Crear los asientos reservados usando los mismos valores
          const asientosData = asientos.map((asiento) => ({
            idSala: parseInt(metadata.id_sala, 10),
            filaAsiento: asiento.filaAsiento,
            nroAsiento: parseInt(asiento.nroAsiento, 10),
            fechaHoraFuncion: fechaFuncionDate,
            DNI: parseInt(metadata.dni, 10),
            fechaHoraReserva: fechaReservaDate,
          }));

          await createAsientosReservados(asientosData);

          logger.info('Reserva completada exitosamente:', {
            asientosCount: asientosData.length,
            paymentId: result.id,
          });
        } catch (createError) {
          logger.error('Error al crear reserva/asientos:', createError);
          throw createError;
        }
      } else {
        logger.info(`Pago recibido con estado: ${result.status}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    logger.error('Error manejando webhook de Mercado Pago:', error);
    res.sendStatus(500);
  }
};
