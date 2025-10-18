// Utility functions specific to Funciones date handling

export const formatFuncionDateTime = (fechaHoraFuncion) => {
  if (!fechaHoraFuncion) return '';
  
  const fecha = new Date(fechaHoraFuncion);
  
  // Format as DD/MM/YYYY HH:MM
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  
  return `${dia}/${mes}/${año} ${horas}:${minutos}`;
};

export const createDateFilter = (dateString, isEndDate = false) => {
  if (!dateString) return null;
  
  const time = isEndDate ? 'T23:59:59' : 'T00:00:00';
  return new Date(dateString + time);
};

export const isDateInRange = (funcionDate, fechaDesde, fechaHasta) => {
  const fecha = new Date(funcionDate);
  
  if (fechaDesde && fecha < fechaDesde) return false;
  if (fechaHasta && fecha > fechaHasta) return false;
  
  return true;
};

export const getCurrentDateForInput = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const addDaysToDate = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};
