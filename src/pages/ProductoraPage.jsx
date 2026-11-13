import CrudCatalogo from '../components/CrudCatalogo';
import { productoraService } from '../services/api';

const campos = [
  { nombre: 'nombre', etiqueta: 'Nombre', requerido: true },
  { nombre: 'slogan', etiqueta: 'Slogan' },
  { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
];

export default function ProductoraPage() {
  return (
    <CrudCatalogo
      titulo="Productoras"
      singular="Productora"
      icono="bi-building"
      servicio={productoraService}
      claveLista="productoras"
      campos={campos}
      campoNombre="nombre"
    />
  );
}
