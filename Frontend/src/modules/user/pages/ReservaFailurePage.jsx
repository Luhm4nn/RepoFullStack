import { useNavigate } from "react-router-dom";

function ReservaFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Pago rechazado</h1>
          <p className="text-gray-400 text-center mb-8">
            No pudimos procesar tu pago. Por favor, intenta nuevamente.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold"
            >
              Intentar nuevamente
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

export default ReservaFailurePage;