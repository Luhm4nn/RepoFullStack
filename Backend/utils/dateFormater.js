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

// Format datetime for backend error messages (DD/MM/YYYY HH:MM)
export const formatDateTimeForBackendMessage = (dateString) => {
  if (!dateString) return 'Sin fecha';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
