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
  
  // CRÍTICO: Crear el objeto Date directamente desde el string ISO.
  // JavaScript lo interpreta automáticamente como UTC y lo convierte a la hora local.
  const dateObj = new Date(dateTimeString); 
  
  if (isNaN(dateObj.getTime())) {
    return { fecha: 'Fecha inválida', hora: 'Hora inválida' };
  }
  
  // Ahora, usa toLocaleTimeString para obtener la hora ajustada a GMT-3
  const hora = dateObj.toLocaleTimeString('es-LA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // O true, según prefieras
  });

  // Usa toLocaleDateString para la fecha ajustada
  const fecha = dateObj.toLocaleDateString('es-LA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  return {
    fecha: fecha,
    hora: hora 
  };
};



// Format datetime-local input string to ISO format for backend
export const formatDateTimeForBackend = (fechaHoraString) => {
  if (!fechaHoraString) return null;
  
  // 1. Crea un objeto Date local (Ej: 2025-10-01 10:00:00 GMT-0300)
  const fechaLocal = new Date(fechaHoraString); 
  
  if (isNaN(fechaLocal.getTime())) {
    return null;
  }
  
  // 2. toISOString() convierte la hora local a su equivalente en UTC/ISO.
  //    (Ej: 10:00 AM GMT-3 -> 13:00 PM UTC)
  //    Esto corrige el problema de "3hs después".
  return fechaLocal.toISOString(); 
};

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
