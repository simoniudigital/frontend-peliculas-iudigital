// Modal de Bootstrap controlado por React (sin depender del JavaScript de Bootstrap)
export default function Modal({ titulo, abierto, onCerrar, children, tamano = '' }) {
  if (!abierto) return null;
  return (
    <>
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
    </>
  );
}
