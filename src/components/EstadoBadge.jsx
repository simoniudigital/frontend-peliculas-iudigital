export default function EstadoBadge({ estado }) {
  return <span className={`badge ${estado === 'Activo' ? 'text-bg-success' : 'text-bg-secondary'}`}>{estado}</span>;
}
