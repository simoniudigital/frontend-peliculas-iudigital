import { useEffect, useMemo, useState } from 'react';
import Modal from './Modal';
import EstadoBadge from './EstadoBadge';
import Cargando from './Cargando';
import { alertaError, alertaExito, confirmarEliminar } from '../services/alertas';
import { formatoFecha } from '../services/formato';

/**
 * Pantalla reutilizable para los módulos de catálogo (Género, Director, Productora y Tipo).
 * Lista los registros desde la API y permite crearlos, editarlos, activarlos/inactivarlos y eliminarlos.
 *
 * props:
 *  - titulo, singular, icono: textos de la pantalla
 *  - servicio: funciones CRUD de services/api.js
 *  - claveLista: propiedad de la respuesta de la API que trae la lista (ej. 'generos')
 *  - campos: [{ nombre, etiqueta, tipo: 'text' | 'textarea', requerido }]
 *  - campoNombre: campo que identifica el registro (ej. 'nombre' o 'nombres')
 *  - conEstado: si el módulo maneja estado Activo/Inactivo
 */
export default function CrudCatalogo({ titulo, singular, icono, servicio, claveLista, campos, campoNombre, conEstado = true }) {
  const formularioVacio = useMemo(
    () => Object.fromEntries([...campos.map((c) => [c.nombre, '']), ...(conEstado ? [['estado', 'Activo']] : [])]),
    [campos, conEstado]
  );

  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await servicio.listar(filtroEstado ? { estado: filtroEstado } : undefined);
      setRegistros(data[claveLista]);
    } catch (error) {
      alertaError(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroEstado]);

  const abrirCrear = () => {
    setEditandoId(null);
    setFormulario(formularioVacio);
    setModalAbierto(true);
  };

  const abrirEditar = (registro) => {
    setEditandoId(registro._id);
    setFormulario(Object.fromEntries(Object.keys(formularioVacio).map((k) => [k, registro[k] ?? ''])));
    setModalAbierto(true);
  };

  const cambiarCampo = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editandoId) {
        await servicio.actualizar(editandoId, formulario);
        alertaExito(`${singular} actualizado(a)`);
      } else {
        await servicio.crear(formulario);
        alertaExito(`${singular} creado(a)`);
      }
      setModalAbierto(false);
      cargar();
    } catch (error) {
      alertaError(error);
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (registro) => {
    const estado = registro.estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await servicio.actualizar(registro._id, { estado });
      alertaExito(`${singular} ${estado === 'Activo' ? 'activado(a)' : 'inactivado(a)'}`);
      cargar();
    } catch (error) {
      alertaError(error);
    }
  };

  const eliminar = async (registro) => {
    if (!(await confirmarEliminar(registro[campoNombre]))) return;
    try {
      await servicio.eliminar(registro._id);
      alertaExito(`${singular} eliminado(a)`);
      cargar();
    } catch (error) {
      alertaError(error);
    }
  };

  const filtrados = registros.filter((r) => r[campoNombre].toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="container py-4">
      <div className="page-header">
        <h2 className="h3 mb-0">
          <i className={`bi ${icono} me-2 text-danger`} />
          {titulo}
        </h2>
        <button className="btn btn-iu" onClick={abrirCrear}>
          <i className="bi bi-plus-lg me-1" /> Nuevo(a) {singular.toLowerCase()}
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <input className="form-control" placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            {conEstado && (
              <div className="col-md-4">
                <select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} aria-label="Filtrar por estado">
                  <option value="">Todos los estados</option>
                  <option value="Activo">Activos</option>
                  <option value="Inactivo">Inactivos</option>
                </select>
              </div>
            )}
          </div>

          {cargando ? (
            <Cargando />
          ) : filtrados.length === 0 ? (
            <p className="text-center text-muted py-4 mb-0">No hay registros para mostrar.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    {campos.map((c) => (
                      <th key={c.nombre}>{c.etiqueta}</th>
                    ))}
                    {conEstado && <th>Estado</th>}
                    <th>Creación</th>
                    <th>Actualización</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((r) => (
                    <tr key={r._id}>
                      {campos.map((c) => (
                        <td key={c.nombre} className={c.nombre === campoNombre ? 'fw-semibold' : 'text-muted small'}>
                          {r[c.nombre]}
                        </td>
                      ))}
                      {conEstado && (
                        <td>
                          <EstadoBadge estado={r.estado} />
                        </td>
                      )}
                      <td className="small text-nowrap">{formatoFecha(r.fechaCreacion)}</td>
                      <td className="small text-nowrap">{formatoFecha(r.fechaActualizacion)}</td>
                      <td className="text-end text-nowrap">
                        <button className="btn btn-sm btn-outline-primary me-1" title="Editar" onClick={() => abrirEditar(r)}>
                          <i className="bi bi-pencil" />
                        </button>
                        {conEstado && (
                          <button
                            className={`btn btn-sm me-1 ${r.estado === 'Activo' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                            title={r.estado === 'Activo' ? 'Inactivar' : 'Activar'}
                            onClick={() => cambiarEstado(r)}
                          >
                            <i className={`bi ${r.estado === 'Activo' ? 'bi-toggle-on' : 'bi-toggle-off'}`} />
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => eliminar(r)}>
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal titulo={editandoId ? `Editar ${singular.toLowerCase()}` : `Nuevo(a) ${singular.toLowerCase()}`} abierto={modalAbierto} onCerrar={() => setModalAbierto(false)}>
        <form onSubmit={guardar}>
          {campos.map((c) => (
            <div className="mb-3" key={c.nombre}>
              <label className="form-label" htmlFor={c.nombre}>
                {c.etiqueta} {c.requerido && <span className="text-danger">*</span>}
              </label>
              {c.tipo === 'textarea' ? (
                <textarea id={c.nombre} name={c.nombre} className="form-control" rows="3" value={formulario[c.nombre]} onChange={cambiarCampo} />
              ) : (
                <input id={c.nombre} name={c.nombre} className="form-control" value={formulario[c.nombre]} onChange={cambiarCampo} required={c.requerido} />
              )}
            </div>
          ))}
          {conEstado && (
            <div className="mb-3">
              <label className="form-label" htmlFor="estado">Estado</label>
              <select id="estado" name="estado" className="form-select" value={formulario.estado} onChange={cambiarCampo}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          )}
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-iu" disabled={guardando}>
              {guardando && <span className="spinner-border spinner-border-sm me-1" />}
              {editandoId ? 'Guardar cambios' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
