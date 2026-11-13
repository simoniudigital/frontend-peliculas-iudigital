import CrudCatalogo from '../components/CrudCatalogo';
import { tipoService } from '../services/api';

const campos = [
  { nombre: 'nombre', etiqueta: 'Nombre', requerido: true },
  { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
];

export default function TipoPage() {
  return (
    <CrudCatalogo
      titulo="Tipos de multimedia"
      singular="Tipo"
      icono="bi-collection-play"
      servicio={tipoService}
      claveLista="tipos"
      campos={campos}
      campoNombre="nombre"
      conEstado={false}
    />
  );
}
