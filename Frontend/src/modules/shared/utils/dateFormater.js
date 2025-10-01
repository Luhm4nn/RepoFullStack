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

// Format datetime-local input string to ISO format for backend
export const formatDateTimeForBackend = (fechaHoraString) => {
  if (!fechaHoraString) return null;
  
  // 1. Usa el constructor de Date con el string de 'datetime-local'.
  // Esto crea un objeto Date con el huso horario local (Ej: 20:00 GMT-3)
  const fechaLocal = new Date(fechaHoraString); 
  
  if (isNaN(fechaLocal.getTime())) {
    return null;
  }
  
  // 2. toISOString() convierte la hora local (20:00 GMT-3) a su equivalente en UTC (23:00Z)
  return fechaLocal.toISOString();
};

// Get current datetime in datetime-local format
export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Format date from ISO string to datetime-local input format
export const formatDateForInput = (fechaHoraString) => {
  if (!fechaHoraString) return getCurrentDateTime();
  
  // Extraer fecha y hora por separado
  const [fecha, hora] = fechaHoraString.split('T');
  const [year, month, day] = fecha.split('-');
  const [hours, minutes] = hora.split(':');
  
  return `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Format date from ISO string to date input format (YYYY-MM-DD)
export const formatDateForDateInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split('T')[0]; 
};

// Format date for backend error messages (DD/MM/YYYY)
export const formatDateForBackendMessage = (dateString) => {
  if (!dateString) return 'Sin fecha';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};
