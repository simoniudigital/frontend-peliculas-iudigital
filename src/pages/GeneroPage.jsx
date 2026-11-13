import CrudCatalogo from '../components/CrudCatalogo';
import { generoService } from '../services/api';

const campos = [
  { nombre: 'nombre', etiqueta: 'Nombre', requerido: true },
  { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
];

export default function GeneroPage() {
  return (
    <CrudCatalogo
      titulo="Géneros"
      singular="Género"
      icono="bi-tags"
      servicio={generoService}
      claveLista="generos"
      campos={campos}
      campoNombre="nombre"
    />
  );
}
