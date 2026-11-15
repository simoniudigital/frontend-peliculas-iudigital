import { useEffect, useState } from 'react';

const DURACION_SALIDA = 180;

// Modal de Bootstrap controlado por React (sin depender del JavaScript de Bootstrap).
// Se mantiene montado unos milisegundos al cerrarse para mostrar la animación de salida.
export default function Modal({ titulo, abierto, onCerrar, children, tamano = '' }) {
  const [montado, setMontado] = useState(abierto);
  const [cerrando, setCerrando] = useState(false);

  useEffect(() => {
    if (abierto) {
      setMontado(true);
      setCerrando(false);
      return undefined;
    }
    if (!montado) return undefined;
    setCerrando(true);
    const t = setTimeout(() => {
      setMontado(false);
      setCerrando(false);
    }, DURACION_SALIDA);
    return () => clearTimeout(t);
  }, [abierto]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!abierto) return undefined;
    const alPresionar = (e) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto, onCerrar]);

  if (!montado) return null;
  return (
    <div className={cerrando ? 'modal-cerrando' : ''}>
      <div className="modal-backdrop-custom" onClick={onCerrar} />
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className={`modal-dialog modal-dialog-scrollable ${tamano}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{titulo}</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
