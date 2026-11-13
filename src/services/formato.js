export const formatoFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : '';
