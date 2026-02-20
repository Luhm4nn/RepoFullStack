import Mailjet from 'node-mailjet';
import logger from './logger.js';
import { encryptData } from './qrEncryption.js';
import QRCode from 'qrcode';

/**
 * Devuelve un cliente Mailjet ya autenticado.
 */
function getMailjetClient() {
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
    throw new Error('CONFIG ERROR: MAILJET_API_KEY o MAILJET_SECRET_KEY no están definidas.');
  }
  return Mailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);
}

/**
 * Genera un QR encriptado para una reserva.
 * @returns {Promise<string>} base64 puro (sin prefijo data URL)
 */
async function generateReservaQR(reservaData) {
  const fechaHoraFuncion =
    reservaData.fechaHoraFuncion instanceof Date
      ? reservaData.fechaHoraFuncion
      : new Date(reservaData.fechaHoraFuncion);

  const fechaHoraReserva =
    reservaData.fechaHoraReserva instanceof Date
      ? reservaData.fechaHoraReserva
      : new Date(reservaData.fechaHoraReserva);

  const qrData = {
    idSala: reservaData.idSala,
    fechaHoraFuncion: fechaHoraFuncion.toISOString(),
    DNI: reservaData.DNI,
    fechaHoraReserva: fechaHoraReserva.toISOString(),
  };

  const encryptedData = encryptData(qrData);
  const dataUrl = await QRCode.toDataURL(encryptedData, {
    errorCorrectionLevel: 'L',
    type: 'image/png',
    margin: 1,
    width: 400,
  });

  return dataUrl.replace(/^data:image\/png;base64,/, '');
}

/**
 * Envía el email de confirmación de reserva con el QR como adjunto.
 * @param {Object} reservaData
 */
export async function sendReservaConfirmationEmail(reservaData) {
  const {
    email,
    nombreUsuario,
    nombrePelicula,
    nombreSala,
    fechaHora,
    asientos,
    total,
    reservaParams,
  } = reservaData;

  logger.info('MAILER: Iniciando envío de email.', { email, nombrePelicula });

  const qrBase64 = await generateReservaQR(reservaParams);
  const asientosFormato = asientos.map((a) => `${a.filaAsiento}${a.nroAsiento}`).join(', ');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f0f0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: white; font-size: 28px; margin-bottom: 10px; }
        .header p { color: rgba(255,255,255,0.9); font-size: 14px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 30px; line-height: 1.6; }
        .section { margin-bottom: 30px; border-left: 4px solid #667eea; padding-left: 20px; }
        .section-title { font-size: 16px; font-weight: 600; color: #667eea; margin-bottom: 15px; }
        table.info-grid { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.info-grid td { padding: 10px; background: #f5f5f5; font-size: 14px; color: #333; }
        .info-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px; }
        .info-value { font-size: 15px; font-weight: 600; }
        .qr-notice { text-align: center; padding: 20px 30px; background: #f9f9f9; border-radius: 8px; border: 2px dashed #667eea; margin-bottom: 20px; }
        .qr-notice h3 { color: #333; font-size: 16px; margin-bottom: 8px; }
        .qr-notice p { color: #666; font-size: 13px; }
        .total-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .total-label { font-size: 14px; margin-bottom: 10px; opacity: 0.9; }
        .total-amount { font-size: 32px; font-weight: 700; }
        .instructions { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .instructions-title { font-weight: 600; color: #1976d2; margin-bottom: 10px; }
        .instructions ul { list-style: none; padding-left: 0; }
        .instructions li { padding: 6px 0; color: #333; font-size: 14px; }
        .instructions li:before { content: "✓ "; color: #4caf50; font-weight: bold; }
        .footer { background: #f5f5f5; padding: 20px 30px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #888; }
        .footer p { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Reserva Confirmada!</h1>
          <p>Tu entrada para el cine está lista</p>
        </div>
        <div class="content">
          <div class="greeting">
            <p>¡Hola <strong>${nombreUsuario}</strong>!</p>
            <p>Tu reserva ha sido confirmada. Aquí están los detalles de tu entrada.</p>
          </div>
          <div class="section">
            <h2 class="section-title">Detalles de tu Función</h2>
            <table class="info-grid">
              <tr>
                <td width="50%"><span class="info-label">Película</span><span class="info-value">${nombrePelicula}</span></td>
                <td width="50%"><span class="info-label">Sala</span><span class="info-value">${nombreSala}</span></td>
              </tr>
              <tr>
                <td colspan="2"><span class="info-label">Fecha y Hora</span><span class="info-value">${fechaHora}</span></td>
              </tr>
              <tr>
                <td colspan="2"><span class="info-label">Asientos</span><span class="info-value">${asientosFormato}</span></td>
              </tr>
            </table>
          </div>
          <div class="qr-notice">
            <h3>🎟️ Tu Código QR de Entrada</h3>
            <p>Encontrarás tu código QR adjunto a este correo como <strong>qr-entrada.png</strong>.<br>Presentalo en la puerta del cine para ingresar.</p>
          </div>
          <div class="total-section">
            <div class="total-label">Total Pagado</div>
            <div class="total-amount">$${parseFloat(total).toFixed(2)}</div>
          </div>
          <div class="instructions">
            <div class="instructions-title">📋 Instrucciones Importantes</div>
            <ul>
              <li>Presentá el QR adjunto en la entrada del cine</li>
              <li>Llegá con 15 minutos de anticipación</li>
              <li>No compartas tu código QR con otras personas</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p><strong>Cutzy Cinema</strong></p>
          <p>Plataforma de Reservas de Entradas de Cine</p>
          <p style="margin-top:10px;">📧 cutzycinema@gmail.com</p>
          <p style="margin-top:15px;opacity:0.7;">© 2026 Cutzy Cinema. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `¡Hola ${nombreUsuario}! Tu reserva para "${nombrePelicula}" en ${nombreSala} el ${fechaHora} fue confirmada. Asientos: ${asientosFormato}. Total: $${parseFloat(total).toFixed(2)}. Tu código QR de entrada está adjunto a este correo.`;

  const fromEmail = process.env.MAILJET_FROM_EMAIL || 'cutzycinema@gmail.com';

  const client = getMailjetClient();
  const response = await client.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: { Email: fromEmail, Name: 'Cutzy Cinema' },
        To: [{ Email: email }],
        Subject: `¡Reserva Confirmada! - ${nombrePelicula} en Cutzy Cinema`,
        HTMLPart: htmlContent,
        TextPart: textContent,
        Attachments: [
          {
            ContentType: 'image/png',
            Filename: 'qr-entrada.png',
            Base64Content: qrBase64,
          },
        ],
      },
    ],
  });

  logger.info('MAILER: Email enviado exitosamente via Mailjet.', {
    status: response.response.status,
    to: email,
  });

  return true;
}

/**
 * Verifica que las credenciales de Mailjet estén configuradas.
 */
export async function verifyEmailConnection() {
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
    logger.error('MAILER: MAILJET_API_KEY o MAILJET_SECRET_KEY no configuradas.');
    return false;
  }
  logger.info('MAILER: Credenciales de Mailjet configuradas correctamente.');
  return true;
}
