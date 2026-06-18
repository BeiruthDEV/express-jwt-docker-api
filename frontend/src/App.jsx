import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import Motos from './pages/Motos';
import ClothingBrands from './pages/ClothingBrands';
import Users from './pages/Users';
import Settings from './pages/Settings';
import { getBrandLogoUrl } from './utils/brandLogos';

if (import.meta.env.DEV) {
  const url = getBrandLogoUrl('Toyota');
  const masked = url ? url.replace(/token=([^&]+)/, (_, t) => `token=${t.slice(0, 5)}…(${t.length})`) : null;
  // eslint-disable-next-line no-console
  console.log('[logo.dev] hasToken:', Boolean(import.meta.env.VITE_LOGO_DEV_TOKEN), 'sampleUrl:', masked);
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cars"
          element={
            <ProtectedRoute>
              <Cars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/motos"
          element={
            <ProtectedRoute>
              <Motos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clothing-brands"
          element={
            <ProtectedRoute>
              <ClothingBrands />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute adminOnly>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
