const formatearFecha = (fechaString) => {
  if (!fechaString) return 'Sin fecha';
  
  // Extraer solo la parte de fecha (antes de la T)
  const soloFecha = fechaString.split('T')[0];
  const [year, month, day] = soloFecha.split('-');
  const fecha = new Date(year, month - 1, day);
  
  if (isNaN(fecha.getTime())) {
    return 'Fecha inválida';
  }
  
  return fecha.toLocaleDateString('es-LA', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

export default formatearFecha;