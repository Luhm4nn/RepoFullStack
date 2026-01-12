import { memo } from "react";

/**
 * Componente base de spinner
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Tamaño del spinner
 * @param {'primary'|'secondary'|'white'|'success'} props.variant - Variante de color
 */
export const Spinner = memo(
  ({ size = "md", variant = "primary", className = "" }) => {
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
  }
);

/**
 * Spinner optimizado para botones
 * @param {'sm'|'md'} props.size - Tamaño (default: 'sm')
 */
export const ButtonSpinner = memo(({ size = "sm", className = "" }) => (
  <Spinner size={size} variant="white" className={className} />
));

/**
 * Spinner centrado con mensaje opcional
 */
export const CenteredSpinner = memo(
  ({
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
  )
);

/**
 * Loader de pantalla completa con backdrop
 * @param {string} props.message - Mensaje a mostrar
 * @param {'primary'|'secondary'|'white'} props.variant - Variante de color
 */
export const FullScreenLoader = memo(
  ({ message = "Cargando...", variant = "primary" }) => (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" variant={variant} />
          <p className="text-white text-lg font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
);

/**
 * Loader overlay para modales y contenedores
 * @param {string} props.message - Mensaje a mostrar
 * @param {'primary'|'secondary'|'white'} props.variant - Variante de color
 */
export const OverlayLoader = memo(
  ({ message = "Procesando...", variant = "primary" }) => (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-lg z-40">
      <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" variant={variant} />
          <p className="text-white text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
);

/**
 * Loader con puntos animados (alternativa)
 */
export const DotsLoader = memo(({ className = "" }) => (
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
));

/**
 * Loader optimizado para tablas
 * @param {string} props.message - Mensaje a mostrar
 */
export const TableLoader = memo(({ message = "Cargando datos..." }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-4">
    <Spinner size="lg" variant="primary" />
    <p className="text-gray-400 text-base">{message}</p>
  </div>
));

/**
 * Spinner inline para mostrar junto a texto
 * @param {string} props.text - Texto a mostrar
 */
export const InlineSpinner = memo(({ text = "Cargando" }) => (
  <div className="flex items-center gap-2">
    <Spinner size="sm" variant="primary" />
    <span className="text-gray-400 text-sm">{text}</span>
  </div>
));
