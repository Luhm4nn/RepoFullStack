//Parse and format date to ISO 8601 string
export const formatToISO8601 = (date) => {
  if (!date) return null;

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return null;

  return dateObj.toISOString();
};
