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
  
  // Extraer fecha y hora por separado
  const [fecha, hora] = fechaHoraString.split('T');
  const [year, month, day] = fecha.split('-');
  const [hours, minutes] = hora.split(':');
  
  // Crear fecha local sin conversión automática de zona horaria
  const fechaLocal = new Date(year, month - 1, day, hours, minutes);
  
  if (isNaN(fechaLocal.getTime())) {
    return null;
  }
  
  // Formatear manualmente para evitar conversión UTC
  const yearStr = fechaLocal.getFullYear();
  const monthStr = String(fechaLocal.getMonth() + 1).padStart(2, '0');
  const dayStr = String(fechaLocal.getDate()).padStart(2, '0');
  const hoursStr = String(fechaLocal.getHours()).padStart(2, '0');
  const minutesStr = String(fechaLocal.getMinutes()).padStart(2, '0');
  const secondsStr = String(fechaLocal.getSeconds()).padStart(2, '0');
  
  return `${yearStr}-${monthStr}-${dayStr}T${hoursStr}:${minutesStr}:${secondsStr}.000Z`;
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
