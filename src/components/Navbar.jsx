import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const enlaces = [
  { to: '/medias', texto: 'Películas y series', icono: 'bi-film' },
  { to: '/generos', texto: 'Géneros', icono: 'bi-tags' },
  { to: '/directores', texto: 'Directores', icono: 'bi-person-video' },
  { to: '/productoras', texto: 'Productoras', icono: 'bi-building' },
  { to: '/tipos', texto: 'Tipos', icono: 'bi-collection-play' },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/" onClick={() => setAbierto(false)}>
          <i className="bi bi-play-btn-fill me-2" />
          IU Películas <small className="text-secondary fw-normal">Admin</small>
        </Link>
        <button className="navbar-toggler" type="button" aria-label="Mostrar menú" onClick={() => setAbierto(!abierto)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${abierto ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            {enlaces.map((e) => (
              <li className="nav-item" key={e.to}>
                <NavLink className="nav-link" to={e.to} onClick={() => setAbierto(false)}>
                  <i className={`bi ${e.icono} me-1`} />
                  {e.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
