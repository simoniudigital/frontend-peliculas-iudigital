export default function EstadoBadge({ estado }) {
  // La clave por estado hace que la insignia rebote cada vez que cambia
  return <span key={estado} className={`badge badge-estado ${estado === 'Activo' ? 'text-bg-success' : 'text-bg-secondary'}`}>{estado}</span>;
}
