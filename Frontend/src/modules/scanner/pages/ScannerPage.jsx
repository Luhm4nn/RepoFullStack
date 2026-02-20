import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { validateQR } from '../../../api/scanner.api';
import ScannerResultModal from '../components/ScannerResultModal';

function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'file'
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastScanTimeRef = useRef(0);
  const SCAN_COOLDOWN_MS = 10000; // 10 segundos entre escaneos

  useEffect(() => {
    // Configuración del scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    // Crear scanner
    html5QrcodeScannerRef.current = new Html5QrcodeScanner('qr-reader', config, false);

    // Callback cuando se detecta un QR
    const onScanSuccess = async (decodedText) => {
      const now = Date.now();
      if (now - lastScanTimeRef.current < SCAN_COOLDOWN_MS) return;
      lastScanTimeRef.current = now;

      setLoading(true);
      setError(null);

      try {
        // Validar QR con el backend
        const response = await validateQR(decodedText);
        setResult(response);
        setScanning(false);

        // Detener el scanner después de una validación exitosa
        if (html5QrcodeScannerRef.current) {
          html5QrcodeScannerRef.current.clear();
        }
      } catch (err) {
        console.error('Error validando QR:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Error al validar el QR';
        const errorCode = err.response?.data?.error?.code;

        setError({
          message: errorMessage,
          code: errorCode,
        });

        // No detener el scanner en caso de error, permitir escanear otro QR
      } finally {
        setLoading(false);
      }
    };

    const onScanError = (errorMessage) => {
      // Ignorar errores de escaneo normales (cuando no detecta QR)
      // Solo logear errores importantes
      if (!errorMessage.includes('NotFoundException')) {
        console.warn('Error de escaneo:', errorMessage);
      }
    };

    // Iniciar el scanner
    html5QrcodeScannerRef.current.render(onScanSuccess, onScanError);
    setScanning(true);

    // Cleanup al desmontar
    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('qr-reader-file');

      const decodedText = await html5QrCode.scanFile(file, true);

      // Validar QR con el backend
      const response = await validateQR(decodedText);
      setResult(response);

      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error escaneando archivo:', err);

      // Determinar el tipo de error
      let errorMessage = 'Error al escanear la imagen';
      let errorCode = null;

      if (err.message && err.message.includes('MultiFormat Readers')) {
        errorMessage =
          'No se pudo detectar un código QR en la imagen. Asegúrate de que la imagen sea clara y el QR esté visible.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        errorCode = err.response.data.error?.code;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError({
        message: errorMessage,
        code: errorCode,
      });

      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScanAgain = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">Escáner de QR</h1>
          <p className="text-gray-300">Apunta la cámara al código QR de la reserva</p>
        </div>

        {/* Scanner Container */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700 mb-6">
          <div id="qr-reader" ref={scannerRef} className="w-full"></div>
          <div id="qr-reader-file" className="hidden"></div>

          {/* File Upload Option */}
          <div className="mt-6 text-center">
            <div className="relative inline-block">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="qr-file-input"
              />
              <label
                htmlFor="qr-file-input"
                className="cursor-pointer px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Escanear desde imagen
              </label>
            </div>
            <p className="text-gray-400 text-sm mt-2">O sube una imagen con el código QR</p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="text-white mt-4">Validando reserva...</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        {scanning && !loading && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex gap-3">
              <svg
                className="w-6 h-6 text-blue-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-blue-300 font-semibold mb-1">Instrucciones</p>
                <p className="text-blue-200 text-sm">
                  Coloca el código QR dentro del recuadro. La validación se realizará
                  automáticamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de resultado */}
      {(result || error) && (
        <ScannerResultModal result={result} error={error} onClose={handleScanAgain} />
      )}
    </div>
  );
}

export default ScannerPage;
