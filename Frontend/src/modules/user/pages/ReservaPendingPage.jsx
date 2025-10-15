import { useNavigate } from "react-router-dom";

function ReservaPendingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Pago pendiente</h1>
          <p className="text-gray-400 text-center mb-8">
            Tu pago está siendo procesado. Te notificaremos cuando se confirme.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/MisReservas')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold"
            >
              Ver mis reservas
            </button>
            <button
              onClick={() => navigate('/cartelera')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold"
            >
              Volver a Cartelera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservaPendingPage;