import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { createOne as createReserva } from '../Funciones/reservas.repository.js';
import { createMany as createAsientosReservados } from '../Funciones/asientoreservas.repository.js';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
})

// Crear preferencia de pago
export const createPaymentPreference = async (req, res) => {
  const { reserva, asientos } = req.body

  try {
    const preference = new Preference(client)

    const body = {
      items: [
        {
          title: `Reserva - ${reserva.nombrePelicula}`,
          description: `Función: ${reserva.fecha} ${reserva.hora} - ${reserva.sala}`,
          quantity: asientos.length,
          unit_price: parseFloat(reserva.total) / asientos.length,
          currency_id: 'ARS'
        }
      ],
      back_urls: {
        success: `https://localhost:5173/reserva/success`,
        failure: `https://localhost:5173/reserva/failure`,
        pending: `https://localhost:5173/reserva/pending`
      },
      notification_url: `${process.env.NGROK_URL}/mercadopago/webhooks`,
      metadata: {
        id_sala: reserva.idSala.toString(),
        fecha_hora_funcion: reserva.fechaHoraFuncion,
        dni: reserva.DNI.toString(),
        fecha_hora_reserva: reserva.fechaHoraReserva,
        asientos: JSON.stringify(asientos)
      }
    }

    const response = await preference.create({ body })

    return res.json({
      id: response.id,
      init_point: response.init_point
    })
  } catch (error) {
    console.error('Error creando preferencia de pago:', error)
    return res.status(500).json({ error: 'Error al crear preferencia de pago' })
  }
}

// Webhook para notificaciones de pago
export const handleWebhook = async (req, res) => {
  const { type, data } = req.body;

  try {
    if (type === 'payment') {
      const paymentId = data.id;

      const payment = new Payment(client);
      const result = await payment.get({ id: paymentId });

      console.log('Webhook recibido:', {
        paymentId: result.id,
        status: result.status,
        metadata: result.metadata
      });

      if (result.status === 'approved') {
        const metadata = result.metadata;

        // Parsear asientos del metadata
        const asientos = JSON.parse(metadata.asientos);

        // Construir reservaData accediendo correctamente al metadata
        const reservaData = {
          idSala: parseInt(metadata.id_sala, 10),
          fechaHoraFuncion: metadata.fecha_hora_funcion,
          DNI: parseInt(metadata.dni, 10),
          fechaHoraReserva: metadata.fecha_hora_reserva,
          total: result.transaction_amount
        };

        console.log('Creando reserva:', reservaData);
        const reservaCreada = await createReserva(reservaData);

        // Crear los asientos reservados usando los mismos valores
        const asientosData = asientos.map(asiento => ({
          idSala: parseInt(metadata.id_sala, 10),
          filaAsiento: asiento.filaAsiento,
          nroAsiento: parseInt(asiento.nroAsiento, 10),
          fechaHoraFuncion: metadata.fecha_hora_funcion,
          DNI: parseInt(metadata.dni, 10),
          fechaHoraReserva: metadata.fecha_hora_reserva
        }));

        console.log('Creando asientos reservados:', asientosData.length);
        await createAsientosReservados(asientosData);

        console.log('Reserva completada exitosamente:', {
          reserva: reservaCreada,
          asientos: asientosData.length,
          paymentId: result.id
        });

      } else {
        console.log(`Pago recibido con estado: ${result.status}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error manejando webhook de Mercado Pago:', error);
    res.sendStatus(500);
  }
};