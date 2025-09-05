//Parse and format date to ISO 8601 string for backend
export const dateFormaterBackend = (date) => {
  if (!date) return null;

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return null;

  return dateObj.toISOString();
};

// Format date only for display (DD/MM/YYYY)
export const formatDate = (fechaString) => {
  if (!fechaString) return 'Sin fecha';

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

// Format date and time for display purposes
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return { fecha: 'Sin fecha', hora: 'Sin hora' };
  
  const [fechaParte, horaParte] = dateTimeString.split('T');
  const [year, month, day] = fechaParte.split('-');
  const [hours, minutes] = horaParte.substring(0, 5).split(':'); 
  const fechaLocal = new Date(year, month - 1, day, hours, minutes);
  
  if (isNaN(fechaLocal.getTime())) {
    return { fecha: 'Fecha inválida', hora: 'Hora inválida' };
  }
  
  return {
    fecha: formatDate(dateTimeString), 
    hora: `${hours}:${minutes}` 
  };
};
