// Spinner base
export const Spinner = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const variants = {
    primary: "border-purple-600 border-t-transparent",
    secondary: "border-slate-400 border-t-transparent",
    white: "border-white border-t-transparent",
    success: "border-green-500 border-t-transparent",
  };

  return (
    <div
      className={`${sizes[size]} ${variants[variant]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Cargando"
    />
  );
};

// Spinner para botones (inline)
export const ButtonSpinner = ({ className = "" }) => (
  <Spinner size="sm" variant="white" className={className} />
);

// Spinner centrado (para contenedores)
export const CenteredSpinner = ({
  size = "lg",
  variant = "primary",
  message = "Cargando...",
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 ${className}`}
  >
    <Spinner size={size} variant={variant} />
    {message && (
      <p className="text-gray-400 text-sm animate-pulse">{message}</p>
    )}
  </div>
);

// Spinner de pantalla completa
export const FullScreenLoader = ({
  message = "Cargando...",
  variant = "primary",
}) => (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-slate-800 rounded-lg p-8 shadow-2xl">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" variant={variant} />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  </div>
);

// Spinner overlay (para modales)
export const OverlayLoader = ({
  message = "Procesando...",
  variant = "primary",
}) => (
  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-lg z-40">
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" variant={variant} />
        <p className="text-white text-sm font-medium">{message}</p>
      </div>
    </div>
  </div>
);

// Spinner con puntos (alternativa)
export const DotsLoader = ({ className = "" }) => (
  <div className={`flex gap-1 ${className}`}>
    <div
      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
      style={{ animationDelay: "0s" }}
    ></div>
    <div
      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
      style={{ animationDelay: "0.1s" }}
    ></div>
    <div
      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    ></div>
  </div>
);

// Spinner para tablas
export const TableLoader = ({ message = "Cargando datos..." }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-4">
    <Spinner size="lg" variant="primary" />
    <p className="text-gray-400 text-base">{message}</p>
  </div>
);

// Spinner inline para texto
export const InlineSpinner = ({ text = "Cargando" }) => (
  <div className="flex items-center gap-2">
    <Spinner size="sm" variant="primary" />
    <span className="text-gray-400 text-sm">{text}</span>
  </div>
);
