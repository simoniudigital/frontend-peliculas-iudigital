import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import InicioPage from './pages/InicioPage';
import MediaPage from './pages/MediaPage';
import GeneroPage from './pages/GeneroPage';
import DirectorPage from './pages/DirectorPage';
import ProductoraPage from './pages/ProductoraPage';
import TipoPage from './pages/TipoPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/medias" element={<MediaPage />} />
          <Route path="/generos" element={<GeneroPage />} />
          <Route path="/directores" element={<DirectorPage />} />
          <Route path="/productoras" element={<ProductoraPage />} />
          <Route path="/tipos" element={<TipoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="text-center text-muted small py-4">
        Proyecto Integrado II · IU Digital de Antioquia
      </footer>
    </>
  );
}
