import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import Cargando from '../components/Cargando';
import MediaForm from './MediaForm';
import { generoService, mediaService, tipoService } from '../services/api';
import { alertaError, alertaExito, confirmarEliminar } from '../services/alertas';

const PORTADA_DEFECTO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect width="200" height="300" fill="#343a40"/><path d="M80 120v60l50-30z" fill="#adb5bd"/></svg>'
);

export default function MediaPage() {
  const [medias, setMedias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({ titulo: '', tipo: '', genero: '' });
  const [tipos, setTipos] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [modal, setModal] = useState({ abierto: false, media: null });
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const params = Object.fromEntries(Object.entries(filtros).filter(([, v]) => v));
      const data = await mediaService.listar(params);
      setMedias(data.medias);
    } catch (error) {
      alertaError(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    Promise.all([tipoService.listar(), generoService.listar()])
      .then(([t, g]) => {
        setTipos(t.tipos);
        setGeneros(g.generos);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(cargar, 300); // espera a que el usuario termine de escribir
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const cambiarFiltro = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const guardar = async (datos) => {
    setGuardando(true);
    try {
      if (modal.media) {
        await mediaService.actualizar(modal.media._id, datos);
        alertaExito('Producción actualizada');
      } else {
        await mediaService.crear(datos);
        alertaExito('Producción creada');
      }
      setModal({ abierto: false, media: null });
      cargar();
    } catch (error) {
      alertaError(error);
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (media) => {
    if (!(await confirmarEliminar(media.titulo))) return;
    try {
      await mediaService.eliminar(media._id);
      alertaExito('Producción eliminada');
      cargar();
    } catch (error) {
      alertaError(error);
    }
  };

  return (
    <div className="container py-4">
      <div className="page-header">
        <h2 className="h3 mb-0">
          <i className="bi bi-film me-2 text-danger" />
          Películas y series
        </h2>
        <button className="btn btn-iu" onClick={() => setModal({ abierto: true, media: null })}>
          <i className="bi bi-plus-lg me-1" /> Nueva producción
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body row g-2">
          <div className="col-md-6">
            <input name="titulo" className="form-control" placeholder="Buscar por título..." value={filtros.titulo} onChange={cambiarFiltro} />
          </div>
          <div className="col-md-3">
            <select name="tipo" className="form-select" value={filtros.tipo} onChange={cambiarFiltro} aria-label="Filtrar por tipo">
              <option value="">Todos los tipos</option>
              {tipos.map((t) => <option key={t._id} value={t._id}>{t.nombre}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select name="genero" className="form-select" value={filtros.genero} onChange={cambiarFiltro} aria-label="Filtrar por género">
              <option value="">Todos los géneros</option>
              {generos.map((g) => <option key={g._id} value={g._id}>{g.nombre}</option>)}
            </select>
          </div>
        </div>
      </div>

      {cargando ? (
        <Cargando />
      ) : medias.length === 0 ? (
        <p className="text-center text-muted py-5">No hay películas ni series registradas.</p>
      ) : (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
          {medias.map((m) => (
            <div className="col" key={m._id}>
              <div className="card h-100 shadow-sm media-card">
                <img src={m.imagenPortada || PORTADA_DEFECTO} onError={(e) => (e.currentTarget.src = PORTADA_DEFECTO)} className="card-img-top" alt={`Portada de ${m.titulo}`} />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start gap-1 mb-1">
                    <span className="badge text-bg-dark">{m.tipo?.nombre}</span>
                    <span className="small text-muted">{m.anioEstreno}</span>
                  </div>
                  <h3 className="card-title fw-semibold">{m.titulo}</h3>
                  <p className="small text-muted mb-1"><i className="bi bi-tag me-1" />{m.genero?.nombre}</p>
                  <p className="small text-muted mb-1"><i className="bi bi-person-video me-1" />{m.director?.nombres}</p>
                  <p className="small text-muted mb-2"><i className="bi bi-building me-1" />{m.productora?.nombre}</p>
                  <p className="small text-secondary mb-0 text-truncate" title={m.sinopsis}>{m.sinopsis}</p>
                  <p className="small text-muted mt-1 mb-0">Serial: {m.serial}</p>
                </div>
                <div className="card-footer bg-white d-flex gap-1">
                  <a className="btn btn-sm btn-outline-dark flex-fill" href={m.url} target="_blank" rel="noreferrer" title="Ver película">
                    <i className="bi bi-play-fill" />
                  </a>
                  <button className="btn btn-sm btn-outline-primary flex-fill" title="Editar" onClick={() => setModal({ abierto: true, media: m })}>
                    <i className="bi bi-pencil" />
                  </button>
                  <button className="btn btn-sm btn-outline-danger flex-fill" title="Eliminar" onClick={() => eliminar(m)}>
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal titulo={modal.media ? 'Editar producción' : 'Nueva producción'} abierto={modal.abierto} onCerrar={() => setModal({ abierto: false, media: null })} tamano="modal-lg">
        <MediaForm key={modal.media?._id || 'nueva'} media={modal.media} guardando={guardando} onGuardar={guardar} onCancelar={() => setModal({ abierto: false, media: null })} />
      </Modal>
    </div>
  );
}
