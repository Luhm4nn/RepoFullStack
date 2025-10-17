export function ModalCierreSesion({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-gray-800/95 rounded-lg p-6 w-11/12 max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">¿Estás seguro de que deseas cerrar sesión?</h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
