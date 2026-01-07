export const Skeleton = ({
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
};

export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} width="flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton variant="card" />
        <Skeleton width="w-3/4" />
        <Skeleton width="w-1/2" />
      </div>
    ))}
  </div>
);

export const MovieCardSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <Skeleton height="h-96" rounded="rounded-lg" className="mb-3" />
        <Skeleton width="w-full" className="mb-2" />
        <Skeleton width="w-2/3" />
      </div>
    ))}
  </div>
);

export const TableRowSkeleton = ({ columns = 6, height = "h-12" }) => (
  <div className="flex gap-4 items-center">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} width="flex-1" height={height} />
    ))}
  </div>
);

export const TextSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? "w-3/4" : "w-full"}
        height="h-4"
      />
    ))}
  </div>
);

export const CircleSkeleton = ({ size = "w-10 h-10", className = "" }) => (
  <Skeleton
    variant="circle"
    width={size.split(" ")[0]}
    height={size.split(" ")[1] || size.split(" ")[0]}
    rounded="rounded-full"
    className={className}
  />
);

export const FormSkeleton = ({ fields = 5, hasButton = true }) => (
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
);

export const MovieAdminCardSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex gap-4 p-4 bg-slate-800/50 rounded-lg animate-pulse"
      >
        <Skeleton width="w-24" height="h-36" rounded="rounded-md" />
        <div className="flex-1 space-y-3">
          <Skeleton width="w-1/2" height="h-6" />
          <Skeleton width="w-full" height="h-4" />
          <Skeleton width="w-3/4" height="h-4" />
          <div className="flex gap-2 mt-4">
            <Skeleton width="w-20" height="h-8" rounded="rounded-md" />
            <Skeleton width="w-20" height="h-8" rounded="rounded-md" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const CarouselSkeleton = () => (
  <div className="animate-pulse">
    <Skeleton height="h-[400px] md:h-[550px]" rounded="rounded-xl" />
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} width="w-2" height="h-2" rounded="rounded-full" />
      ))}
    </div>
  </div>
);

export const ReservaCardSkeleton = ({ count = 3 }) => (
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
);
