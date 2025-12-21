// PASO 1: Agregar botón "Ver Detalle" en vista DESKTOP
// Ubicación: Línea ~232, dentro del div con className="flex items-center gap-2"
// Agregar ANTES del botón de Publicar/Privatizar

\u003cButton
size = "sm"
className = "w-full sm:w-auto text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
onClick = {() =\u003e openDetailModal(funcion)}
\u003e
\u003csvg xmlns = "http://www.w3.org/2000/svg" fill = "none" viewBox = "0 0 24 24" strokeWidth = "1.5" stroke = "currentColor" className = "size-6 mr-1"\u003e
\u003cpath strokeLinecap = "round" strokeLinejoin = "round" d = "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /\u003e
\u003cpath strokeLinecap = "round" strokeLinejoin = "round" d = "M15 12a3 3 0 11-6 0 3 3 0 016 0z" /\u003e
\u003c / svg\u003e
  Ver Detalle
\u003c / Button\u003e

// ==========================================

// PASO 2: Agregar botón "Ver Detalle" en vista MOBILE  
// Ubicación: Línea ~350, dentro del div con className="flex flex-col gap-2 pt-2"
// Agregar ANTES del botón de Publicar/Privatizar

\u003cButton
size = "sm"
className = "w-full text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
onClick = {() =\u003e openDetailModal(funcion)}
\u003e
\u003csvg xmlns = "http://www.w3.org/2000/svg" fill = "none" viewBox = "0 0 24 24" strokeWidth = "1.5" stroke = "currentColor" className = "w-4 h-4 mr-2 text-white"\u003e
\u003cpath strokeLinecap = "round" strokeLinejoin = "round" d = "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /\u003e
\u003cpath strokeLinecap = "round" strokeLinejoin = "round" d = "M15 12a3 3 0 11-6 0 3 3 0 016 0z" /\u003e
\u003c / svg\u003e
  Ver Detalle
\u003c / Button\u003e

// ==========================================

// PASO 3: Renderizar el modal
// Ubicación: Línea ~445, DESPUÉS del ErrorModal y ANTES del cierre del div principal
// Agregar al final del return, justo antes de \u003c/div\u003e

{/* Detail modal */ }
{
    showDetailModal && funcionToDetail && (
    \u003cdiv className = "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"\u003e
    \u003cDetalleFuncionModal
    funcion = { funcionToDetail }
    detalles = { detallesFuncion }
    onClose = { closeDetailModal }
        /\u003e
    \u003c / div\u003e
)
}
