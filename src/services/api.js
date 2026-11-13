import axios from 'axios';

// Instancia de axios apuntando a la API REST de la EA1
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Crea las funciones CRUD de un recurso de la API (generos, directores, productoras, tipos, medias)
const crearServicio = (recurso) => ({
  listar: (params) => api.get(`/${recurso}`, { params }).then((r) => r.data),
  obtener: (id) => api.get(`/${recurso}/${id}`).then((r) => r.data),
  crear: (datos) => api.post(`/${recurso}`, datos).then((r) => r.data),
  actualizar: (id, datos) => api.put(`/${recurso}/${id}`, datos).then((r) => r.data),
  eliminar: (id) => api.delete(`/${recurso}/${id}`).then((r) => r.data),
});

export const generoService = crearServicio('generos');
export const directorService = crearServicio('directores');
export const productoraService = crearServicio('productoras');
export const tipoService = crearServicio('tipos');
export const mediaService = crearServicio('medias');

// Convierte el error de axios en un mensaje legible a partir de la respuesta de la API
export const mensajeError = (error) => {
  if (!error.response) return 'No fue posible conectar con la API. Verifique que el servidor esté en ejecución.';
  const { msg, errores } = error.response.data || {};
  if (errores?.length) return errores.map((e) => `• ${e.msg}`).join('<br>');
  return msg || 'Ocurrió un error inesperado';
};
