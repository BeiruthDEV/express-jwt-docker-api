import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../auth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin()) return <Navigate to="/" replace />;
  return children;
}
