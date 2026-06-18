import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import Motos from './pages/Motos';
import ClothingBrands from './pages/ClothingBrands';
import Users from './pages/Users';

export default function App() {
  return (
    <div className="min-h-screen bg-canvas">
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
