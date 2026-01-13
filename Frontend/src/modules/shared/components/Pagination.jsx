import { Button } from "flowbite-react";

/**
 * Componente de paginación
 * @param {number} currentPage - Página actual (1-indexed)
 * @param {number} totalItems - Total de elementos
 * @param {number} itemsPerPage - Elementos por página
 * @param {function} onPageChange - Callback cuando cambia la página
 */
function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // No mostrar paginación si solo hay una página o menos
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
      {/* Información de elementos */}
      <div className="text-sm text-gray-400">
        Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} elementos
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón anterior */}
        <Button
          size="sm"
          disabled={currentPage === 1}
          onClick={handlePrevious}
          className={`
            ${currentPage === 1 
              ? 'bg-gray-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Button>

        {/* Números de página */}
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                size="sm"
                onClick={() => handlePageClick(page)}
                className={`
                  min-w-[40px]
                  ${page === currentPage
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                    : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                  }
                `}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Botón siguiente */}
        <Button
          size="sm"
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className={`
            ${currentPage === totalPages 
              ? 'bg-gray-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
export { Pagination };
