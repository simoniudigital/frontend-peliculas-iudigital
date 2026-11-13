import { useEffect, useState } from 'react';
import { directorService, generoService, productoraService, tipoService } from '../services/api';
import { alertaError } from '../services/alertas';

const VACIO = {
  serial: '', titulo: '', sinopsis: '', url: '', imagenPortada: '', anioEstreno: '',
  genero: '', director: '', productora: '', tipo: '',
};

// Convierte una media de la API (con referencias pobladas) en los valores del formulario
const aFormulario = (media) => ({
  ...VACIO,
  ...Object.fromEntries(Object.keys(VACIO).map((k) => [k, media[k]?._id ?? media[k] ?? ''])),
});

/**
 * Formulario de creación/edición de películas y series.
 * Según el caso de estudio, solo se listan géneros, directores y productoras ACTIVOS, y todos los tipos.
 */
export default function MediaForm({ media, onGuardar, onCancelar, guardando }) {
  const [formulario, setFormulario] = useState(media ? aFormulario(media) : VACIO);
  const [opciones, setOpciones] = useState({ generos: [], directores: [], productoras: [], tipos: [] });

  useEffect(() => {
    Promise.all([
      generoService.listar({ estado: 'Activo' }),
      directorService.listar({ estado: 'Activo' }),
      productoraService.listar({ estado: 'Activo' }),
      tipoService.listar(),
    ])
      .then(([g, d, p, t]) => setOpciones({ generos: g.generos, directores: d.directores, productoras: p.productoras, tipos: t.tipos }))
      .catch(alertaError);
  }, []);

  const cambiar = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const datos = { ...formulario, anioEstreno: Number(formulario.anioEstreno) };
    if (media) {
      // En la edición solo se envían los campos modificados
      const original = aFormulario(media);
      onGuardar(Object.fromEntries(Object.entries(datos).filter(([k, v]) => String(v) !== String(original[k]))));
    } else {
      onGuardar(datos);
    }
  };

  // Si la media tiene asignado un catálogo que ahora está inactivo, se muestra para no perder el valor actual
  const conActual = (lista, campo, etiqueta) => {
    const actual = media?.[campo];
    if (actual && !lista.some((x) => x._id === actual._id)) return [{ ...actual, [etiqueta]: `${actual[etiqueta]} (inactivo)` }, ...lista];
    return lista;
  };

  const select = (nombre, etiqueta, lista, campoTexto) => (
    <div className="col-md-6 mb-3">
      <label className="form-label" htmlFor={nombre}>
        {etiqueta} <span className="text-danger">*</span>
      </label>
      <select id={nombre} name={nombre} className="form-select" value={formulario[nombre]} onChange={cambiar} required>
        <option value="">Seleccione...</option>
        {lista.map((x) => (
          <option key={x._id} value={x._id}>
            {x[campoTexto]}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={enviar}>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label" htmlFor="serial">Serial <span className="text-danger">*</span></label>
          <input id="serial" name="serial" className="form-control" value={formulario.serial} onChange={cambiar} required placeholder="PEL-001" />
        </div>
        <div className="col-md-8 mb-3">
          <label className="form-label" htmlFor="titulo">Título <span className="text-danger">*</span></label>
          <input id="titulo" name="titulo" className="form-control" value={formulario.titulo} onChange={cambiar} required />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label" htmlFor="sinopsis">Sinopsis</label>
          <textarea id="sinopsis" name="sinopsis" className="form-control" rows="3" value={formulario.sinopsis} onChange={cambiar} />
        </div>
        <div className="col-md-8 mb-3">
          <label className="form-label" htmlFor="url">URL de la película <span className="text-danger">*</span></label>
          <input id="url" name="url" type="url" className="form-control" value={formulario.url} onChange={cambiar} required placeholder="https://..." />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label" htmlFor="anioEstreno">Año de estreno <span className="text-danger">*</span></label>
          <input id="anioEstreno" name="anioEstreno" type="number" min="1888" max={new Date().getFullYear() + 5} className="form-control" value={formulario.anioEstreno} onChange={cambiar} required />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label" htmlFor="imagenPortada">Imagen o foto de portada (URL)</label>
          <div className="d-flex gap-3 align-items-start">
            <input id="imagenPortada" name="imagenPortada" type="url" className="form-control" value={formulario.imagenPortada} onChange={cambiar} placeholder="https://..." />
            {formulario.imagenPortada && <img src={formulario.imagenPortada} alt="Vista previa" style={{ width: 60, height: 90, objectFit: 'cover' }} className="rounded border" />}
          </div>
        </div>
        {select('genero', 'Género principal', conActual(opciones.generos, 'genero', 'nombre'), 'nombre')}
        {select('director', 'Director principal', conActual(opciones.directores, 'director', 'nombres'), 'nombres')}
        {select('productora', 'Productora', conActual(opciones.productoras, 'productora', 'nombre'), 'nombre')}
        {select('tipo', 'Tipo', opciones.tipos, 'nombre')}
      </div>
      <p className="small text-muted">Solo se muestran los géneros, directores y productoras en estado Activo.</p>
      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-iu" disabled={guardando}>
          {guardando && <span className="spinner-border spinner-border-sm me-1" />}
          {media ? 'Guardar cambios' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
