import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { directorService, generoService, mediaService, productoraService, tipoService } from '../services/api';

const modulos = [
  { to: '/medias', titulo: 'Películas y series', icono: 'bi-film', servicio: mediaService, clave: 'medias', texto: 'Agregar, editar, consultar y eliminar producciones.' },
  { to: '/generos', titulo: 'Géneros', icono: 'bi-tags', servicio: generoService, clave: 'generos', texto: 'Acción, aventura, ciencia ficción, drama, terror...' },
  { to: '/directores', titulo: 'Directores', icono: 'bi-person-video', servicio: directorService, clave: 'directores', texto: 'Director principal de cada producción.' },
  { to: '/productoras', titulo: 'Productoras', icono: 'bi-building', servicio: productoraService, clave: 'productoras', texto: 'Disney, Warner, Paramount, MGM...' },
  { to: '/tipos', titulo: 'Tipos', icono: 'bi-collection-play', servicio: tipoService, clave: 'tipos', texto: 'Película, serie y otros tipos de multimedia.' },
];

// Número que cuenta desde 0 hasta el valor final
function Contador({ valor }) {
  const [mostrado, setMostrado] = useState(0);
  const inicio = useRef(null);

  useEffect(() => {
    if (valor === undefined) return undefined;
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducir || valor === 0) {
      setMostrado(valor);
      return undefined;
    }
    let frame;
    inicio.current = null;
    const paso = (t) => {
      if (inicio.current === null) inicio.current = t;
      const progreso = Math.min((t - inicio.current) / 700, 1);
      setMostrado(Math.round(valor * (1 - Math.pow(1 - progreso, 3))));
      if (progreso < 1) frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [valor]);

  return valor === undefined ? '—' : mostrado;
}

export default function InicioPage() {
  const [totales, setTotales] = useState({});
  const [sinConexion, setSinConexion] = useState(false);

  useEffect(() => {
    Promise.all(modulos.map((m) => m.servicio.listar().then((d) => [m.clave, d.total])))
      .then((r) => setTotales(Object.fromEntries(r)))
      .catch(() => setSinConexion(true));
  }, []);

  return (
    <div className="container py-4">
      <div className="p-4 p-md-5 mb-4 bg-dark text-white rounded-3 shadow-sm">
        <h1 className="display-6 fw-semibold">Administrador de películas</h1>
        <p className="lead mb-0 text-white-50">
          Institución Universitaria Digital de Antioquia · Gestión del catálogo de películas y series.
        </p>
      </div>

      {sinConexion && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2" />
          No fue posible conectar con la API. Inicie el proyecto <code>api-peliculas</code> en <code>http://localhost:4000</code>.
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {modulos.map((m, i) => (
          <div className="col entrada-escalonada" key={m.to} style={{ '--i': i }}>
            <Link to={m.to} className="card h-100 shadow-sm text-decoration-none text-reset tarjeta-modulo">
              <div className="card-body d-flex align-items-center gap-3 position-relative">
                <i className={`bi ${m.icono} fs-1 text-danger`} />
                <div>
                  <h2 className="h5 mb-1">{m.titulo}</h2>
                  <p className="small text-muted mb-1">{m.texto}</p>
                  <span className="badge text-bg-light border"><Contador valor={totales[m.clave]} /> registros</span>
                </div>
                <i className="bi bi-arrow-right flecha text-danger" aria-hidden="true" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
