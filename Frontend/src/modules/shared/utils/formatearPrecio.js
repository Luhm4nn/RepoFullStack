export const formatearPrecio = (precio) => {
  if (!precio || precio === 0) return '$0,00';
  
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(precio);
};