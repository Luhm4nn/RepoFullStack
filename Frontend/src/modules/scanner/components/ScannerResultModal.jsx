import { SCANNER_ERROR_CONFIG, SCANNER_COLOR_CLASSES } from '../../../constants';

function CheckCircleIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function XCircleIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ExclamationTriangleIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

function NoSymbolIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  );
}

const ERROR_ICON_MAP = {
  FUNCTION_NOT_STARTED: ClockIcon,
  FUNCTION_ALREADY_ENDED: ClockIcon,
  ALREADY_USED: ExclamationTriangleIcon,
  RESERVATION_CANCELLED: NoSymbolIcon,
};

function InfoRow({ label, value, valueClass = 'text-white font-semibold' }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-700 py-3 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

export default function ScannerResultModal({ result, error, onClose }) {
  if (!result && !error) return null;

  const isSuccess = !!result?.success;

  let colorKey = 'red';
  let title = 'Error de Validación';
  let IconComponent = XCircleIcon;

  if (isSuccess) {
    colorKey = 'green';
    title = 'Asistencia Confirmada';
    IconComponent = CheckCircleIcon;
  } else {
    const errCfg = SCANNER_ERROR_CONFIG[error?.code] || null;
    if (errCfg) {
      colorKey = errCfg.colorClass;
      title = errCfg.title;
      IconComponent = ERROR_ICON_MAP[error.code] || XCircleIcon;
    }
  }

  const colors = SCANNER_COLOR_CLASSES[colorKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-10 w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-700">
          <div
            className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <IconComponent className={`w-12 h-12 ${colors.icon}`} />
          </div>
          <h2 className={`text-2xl font-bold ${colors.title}`}>{title}</h2>
          {!isSuccess && <p className="text-gray-400 text-sm mt-2">{error?.message}</p>}
        </div>

        {/* Body - Solo en éxito */}
        {isSuccess && result.reserva && (
          <div className="p-6">
            <div className="bg-slate-900/50 rounded-xl px-4 py-1">
              <InfoRow label="Película" value={result.reserva.pelicula} />
              <InfoRow label="Sala" value={result.reserva.sala} />
              <InfoRow
                label="Asientos"
                value={`${result.reserva.cantidadAsientos} ${result.reserva.cantidadAsientos === 1 ? 'asiento' : 'asientos'}`}
                valueClass="text-purple-400 font-semibold"
              />
              <InfoRow label="Cliente" value={result.reserva.cliente} />
              <InfoRow label="Estado" value="ASISTIDA" valueClass="text-green-400 font-semibold" />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              isSuccess
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {isSuccess ? 'Escanear Otro QR' : 'Intentar Nuevamente'}
          </button>
        </div>
      </div>
    </div>
  );
}
