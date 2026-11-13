import Swal from 'sweetalert2';
import { mensajeError } from './api';

export const alertaExito = (titulo) =>
  Swal.fire({ icon: 'success', title: titulo, timer: 1600, showConfirmButton: false });

export const alertaError = (error) =>
  Swal.fire({ icon: 'error', title: 'Error', html: mensajeError(error), confirmButtonColor: '#c8102e' });

export const confirmarEliminar = (nombre) =>
  Swal.fire({
    icon: 'warning',
    title: '¿Eliminar registro?',
    html: `Se eliminará <b>${nombre}</b>. Esta acción no se puede deshacer.`,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#c8102e',
  }).then((r) => r.isConfirmed);
