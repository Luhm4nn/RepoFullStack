import nodemailer from 'nodemailer';
import logger from './logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { encryptData } from './qrEncryption.js';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar el transporte de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Genera un QR encriptado para una reserva
 * @param {Object} reservaData - Datos de la reserva {idSala, fechaHoraFuncion, DNI, fechaHoraReserva}
 * @returns {Promise<string>} QR en base64
 */
async function generateReservaQR(reservaData) {
  try {
    const qrData = {
      idSala: reservaData.idSala,
      fechaHoraFuncion: reservaData.fechaHoraFuncion.toISOString(),
      DNI: reservaData.DNI,
      fechaHoraReserva: reservaData.fechaHoraReserva.toISOString(),
    };

    // Encriptar datos
    const encryptedData = encryptData(qrData);

    // Generar QR code como data URL
    const qrCodeDataURL = await QRCode.toDataURL(encryptedData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 200,
    });

    return qrCodeDataURL;
  } catch (error) {
    logger.error('Error generando QR:', error);
    throw error;
  }
}

/**
 * Obtiene el logo de Cutzy como base64
 * @returns {string} Logo en base64
 */
function getLogoBase64() {
  try {
    // Ruta al logo (desde el Frontend)
    const logoPath = path.join(__dirname, '../../Frontend/src/assets/cutzy-logo-color.png');

    if (fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath);
      return Buffer.from(logoData).toString('base64');
    }

    logger.warn('Logo no encontrado en:', logoPath);
    return null;
  } catch (error) {
    logger.error('Error cargando logo:', error);
    return null;
  }
}

/**
 * Envía email de confirmación de reserva
 * @param {Object} reservaData - Datos de la reserva
 */
export async function sendReservaConfirmationEmail(reservaData) {
  try {
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

    // Generar QR usando los parámetros de la reserva
    const qrBase64 = await generateReservaQR(reservaParams);
    const logoBase64 = getLogoBase64();

    // Formatear asientos
    const asientosFormato = asientos.map((a) => `${a.filaAsiento}${a.nroAsiento}`).join(', ');

    // HTML del email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
          }
          
          .logo {
            max-width: 150px;
            margin-bottom: 20px;
          }
          
          .logo img {
            width: 100%;
            height: auto;
          }
          
          .header h1 {
            color: white;
            font-size: 28px;
            margin-bottom: 10px;
          }
          
          .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 30px;
            line-height: 1.6;
          }
          
          .section {
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
            padding-left: 20px;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 15px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .info-item {
            padding: 12px;
            background: #f5f5f5;
            border-radius: 6px;
          }
          
          .info-label {
            font-size: 12px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          
          .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
          
          .full-width {
            grid-column: 1 / -1;
          }
          
          .qr-section {
            text-align: center;
            padding: 30px;
            background: #f9f9f9;
            border-radius: 8px;
            border: 2px dashed #667eea;
          }
          
          .qr-section h3 {
            color: #333;
            font-size: 16px;
            margin-bottom: 20px;
          }
          
          .qr-image {
            display: inline-block;
          }
          
          .qr-image img {
            width: 200px;
            height: 200px;
            border: 3px solid white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .total-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
          }
          
          .total-label {
            font-size: 14px;
            margin-bottom: 10px;
            opacity: 0.9;
          }
          
          .total-amount {
            font-size: 32px;
            font-weight: 700;
          }
          
          .instructions {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          
          .instructions-title {
            font-weight: 600;
            color: #1976d2;
            margin-bottom: 10px;
          }
          
          .instructions ul {
            list-style: none;
            padding-left: 0;
          }
          
          .instructions li {
            padding: 8px 0;
            color: #333;
            font-size: 14px;
          }
          
          .instructions li:before {
            content: "✓ ";
            color: #4caf50;
            font-weight: bold;
            margin-right: 8px;
          }
          
          .footer {
            background: #f5f5f5;
            padding: 20px 30px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
          
          .footer p {
            margin: 5px 0;
          }
          
          .contact-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            ${
              logoBase64
                ? `
              <div class="logo">
                <img src="data:image/png;base64,${logoBase64}" alt="Cutzy Cinema">
              </div>
            `
                : ''
            }
            <h1>¡Reserva Confirmada!</h1>
            <p>Tu entrada para el cine está lista</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="greeting">
              <p>¡Hola <strong>${nombreUsuario}</strong>!</p>
              <p>Tu reserva ha sido confirmada exitosamente. Aquí están los detalles de tu entrada.</p>
            </div>
            
            <!-- Información de la película -->
            <div class="section">
              <h2 class="section-title">Detalles de tu Función</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Película</div>
                  <div class="info-value">${nombrePelicula}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Sala</div>
                  <div class="info-value">${nombreSala}</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">Fecha y Hora</div>
                  <div class="info-value">${fechaHora}</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">Asientos</div>
                  <div class="info-value">${asientosFormato}</div>
                </div>
              </div>
            </div>
            
            <!-- Código QR -->
            <div class="qr-section">
              <h3>Tu Código QR</h3>
              <p style="color: #666; font-size: 12px; margin-bottom: 15px;">Presenta este código en la entrada del cine</p>
              <div class="qr-image">
                <img src="${qrBase64}" alt="Código QR de entrada">
              </div>
            </div>
            
            <!-- Total -->
            <div class="total-section">
              <div class="total-label">Total Pagado</div>
              <div class="total-amount">$${parseFloat(total).toFixed(2)}</div>
            </div>
            
            <!-- Instrucciones -->
            <div class="instructions">
              <div class="instructions-title">📋 Instrucciones Importantes</div>
              <ul>
                <li>Presenta este email o el código QR en la entrada del cine</li>
                <li>Llega con 15 minutos de anticipación</li>
                <li>Ten tu DNI a mano para verificación</li>
                <li>No compartas tu código QR con otras personas</li>
                <li>Si necesitas cancelar, hazlo con al menos 2 horas de anticipación</li>
              </ul>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p><strong>Cutzy Cinema</strong></p>
            <p>Plataforma de Reservas de Entradas de Cine</p>
            <div class="contact-info">
              <p>Para dudas o consultas, contactanos en:</p>
              <p>📧 ${process.env.EMAIL_USER}</p>
            </div>
            <p style="margin-top: 15px; opacity: 0.7;">© 2026 Cutzy Cinema. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `¡Reserva Confirmada! - ${nombrePelicula} en Cutzy Cinema`,
      html: htmlContent,
    };

    // Enviar email
    await transporter.sendMail(mailOptions);
    logger.info(`Email de confirmación enviado a: ${email}`);
    return true;
  } catch (error) {
    logger.error('Error enviando email de confirmación:', error);
    throw error;
  }
}

/**
 * Verifica la conexión del email
 */
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    logger.info('Conexión de email verificada correctamente');
    return true;
  } catch (error) {
    logger.error('Error verificando conexión de email:', error);
    return false;
  }
}
