import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * @param {string} allowedRole - 'user' | 'admin' | 'doctor' (one role only)
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const { token, role } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    const to = role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor' : '/dashboard';
    return <Navigate to={to} replace />;
  }

  return children;
}
