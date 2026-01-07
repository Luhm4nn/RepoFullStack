import { memo } from "react";

/**
 * Componente base de skeleton para loading states
 * @param {Object} props
 * @param {'default'|'circle'|'text'|'card'|'avatar'} props.variant - Variante del skeleton
 * @param {string} props.width - Clase de ancho (ej: 'w-full', 'w-1/2')
 * @param {string} props.height - Clase de altura (ej: 'h-4', 'h-10')
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.rounded - Clase de redondeo (ej: 'rounded', 'rounded-full')
 */
export const Skeleton = memo(
  ({
    variant = "default",
    width = "w-full",
    height = "h-4",
    className = "",
    count = 1,
    rounded = "rounded",
  }) => {
    const variants = {
      default: "bg-slate-700",
      circle: "rounded-full",
      text: "h-4 mb-2",
      card: "h-48 rounded-lg",
      avatar: "w-10 h-10 rounded-full",
    };

    return (
      <div
        className={`animate-pulse ${width} ${height} ${variants[variant]} ${rounded} ${className}`}
      />
    );
  }
);

/**
 * Skeleton para tablas tipo Flowbite
 * @param {number} props.rows - Cantidad de filas
 * @param {number} props.columns - Cantidad de columnas
 */
export const TableSkeleton = memo(({ rows = 5, columns = 6 }) => (
  <div className="overflow-x-auto">
    <div className="min-w-full">
      {/* Table Header */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="flex gap-4 px-6 py-3.5">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1">
              <Skeleton height="h-4" width="w-20" className="bg-slate-600" />
            </div>
          ))}
        </div>
      </div>
      {/* Table Body */}
      <div className="divide-y divide-slate-700">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/50 hover:bg-white/5 transition-colors"
          >
            <div className="flex gap-4 px-6 py-4 items-center">
              {Array.from({ length: columns }).map((_, j) => (
                <div key={j} className="flex-1">
                  <Skeleton
                    height="h-4"
                    className={j === columns - 1 ? "w-24" : ""}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

export const CardSkeleton = memo(({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton variant="card" />
        <Skeleton width="w-3/4" />
        <Skeleton width="w-1/2" />
      </div>
    ))}
  </div>
));

/**
 * Skeleton para tarjetas de películas
 * @param {number} props.count - Cantidad de tarjetas
 */
export const MovieCardSkeleton = memo(({ count = 6 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <Skeleton height="h-96" rounded="rounded-lg" className="mb-3" />
        <Skeleton width="w-full" className="mb-2" />
        <Skeleton width="w-2/3" />
      </div>
    ))}
  </div>
));

/**
 * Skeleton para texto multilínea
 * @param {number} props.lines - Cantidad de líneas
 */
export const TextSkeleton = memo(({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? "w-3/4" : "w-full"}
        height="h-4"
      />
    ))}
  </div>
));

/**
 * Skeleton circular para avatares
 * @param {string} props.size - Clases de tamaño Tailwind
 */
export const CircleSkeleton = memo(({ size = "w-10 h-10", className = "" }) => (
  <Skeleton
    variant="circle"
    width={size.split(" ")[0]}
    height={size.split(" ")[1] || size.split(" ")[0]}
    rounded="rounded-full"
    className={className}
  />
));

/**
 * Skeleton para formularios
 * @param {number} props.fields - Cantidad de campos
 * @param {boolean} props.hasButton - Si incluye botón
 */
export const FormSkeleton = memo(({ fields = 5, hasButton = true }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton width="w-24" height="h-4" className="mb-2" />
        <Skeleton height="h-10" rounded="rounded-md" />
      </div>
    ))}
    {hasButton && (
      <Skeleton
        height="h-10"
        width="w-full md:w-32"
        rounded="rounded-md"
        className="mt-4"
      />
    )}
  </div>
));

/**
 * Skeleton para carrusel de películas
 */
export const CarouselSkeleton = memo(() => (
  <div className="animate-pulse space-y-4">
    {/* Contenedor principal más ancho */}
    <div className="relative h-[400px] md:h-[550px] w-full rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700">
      {/* Fondo con pulso */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-700"></div>

      {/* Sección inferior para simular info */}
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3 bg-gradient-to-t from-slate-900 to-transparent">
        <div className="h-10 bg-slate-600 rounded-lg w-2/3"></div>
        <div className="h-4 bg-slate-600/70 rounded w-full"></div>
        <div className="h-4 bg-slate-600/70 rounded w-4/5"></div>
      </div>
    </div>

    {/* Indicadores */}
    <div className="flex justify-center gap-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-slate-600"></div>
      ))}
    </div>
  </div>
));

/**
 * Skeleton para tarjetas de reserva
 * @param {number} props.count - Cantidad de tarjetas
 */
export const ReservaCardSkeleton = memo(({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-slate-800/50 rounded-lg p-6 animate-pulse space-y-4"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <Skeleton width="w-1/3" height="h-6" />
            <Skeleton width="w-1/2" height="h-4" />
          </div>
          <Skeleton width="w-20" height="h-6" rounded="rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton width="w-full" height="h-4" />
          <Skeleton width="w-2/3" height="h-4" />
        </div>
        <div className="flex gap-2">
          <Skeleton width="w-24" height="h-9" rounded="rounded-md" />
          <Skeleton width="w-24" height="h-9" rounded="rounded-md" />
        </div>
      </div>
    ))}
  </div>
));
