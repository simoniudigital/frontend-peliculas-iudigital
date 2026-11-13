import CrudCatalogo from '../components/CrudCatalogo';
import { directorService } from '../services/api';

const campos = [{ nombre: 'nombres', etiqueta: 'Nombres', requerido: true }];

export default function DirectorPage() {
  return (
    <CrudCatalogo
      titulo="Directores"
      singular="Director"
      icono="bi-person-video"
      servicio={directorService}
      claveLista="directores"
      campos={campos}
      campoNombre="nombres"
    />
  );
}
