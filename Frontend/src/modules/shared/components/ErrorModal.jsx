import { createPortal } from "react-dom";
import { Button } from "flowbite-react";
import { getErrorMetadata } from "../../shared";

const ErrorModal = ({ error, onClose }) => {
  if (!error.show) return null;

  const { title, description } = getErrorMetadata(error.type);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-lg max-w-md mx-4 w-full">
        <h2 className="text-2xl text-white font-bold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-orange-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          {title}
        </h2>
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-gray-300 text-center text-sm">
            {error.message}
          </p>
        </div>
        <p className="mb-5 text-sm text-gray-300 text-center">
          {description}
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={onClose}
            className="w-full sm:w-auto text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-sm"
          >
            Entendido
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ErrorModal;
