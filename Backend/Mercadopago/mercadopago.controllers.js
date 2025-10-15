import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

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
  //auto_return: 'approved',
  notification_url: `http://localhost:4000/mercadopago/webhooks`,
  metadata: {
    idSala: reserva.idSala,
    fechaHoraFuncion: reserva.fechaHoraFuncion,
    DNI: reserva.DNI,
    fechaHoraReserva: reserva.fechaHoraReserva,
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
  const { type, data } = req.body

  try {
    if (type === 'payment') {
      const paymentId = data.id

      const payment = new Payment(client)
      const result = await payment.get({ id: paymentId })

      if (result.status === 'approved') {
        const metadata = result.metadata

        console.log('Pago aprobado:', {
          idPago: result.id,
          monto: result.transaction_amount,
          comprador: result.payer?.email,
          metadata
        })


      } else {
        console.log(` Pago recibido con estado: ${result.status}`)
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.error('Error manejando webhook de Mercado Pago:', error)
    res.sendStatus(500)
  }
}
