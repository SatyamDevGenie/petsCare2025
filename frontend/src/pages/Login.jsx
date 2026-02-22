import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { loginUser, adminLogin, doctorLogin } from '../store/slices/authSlice';
import { clearError } from '../store/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const TABS = [
  { id: 'user', label: 'Pet Owner' },
  { id: 'admin', label: 'Admin' },
  { id: 'doctor', label: 'Doctor' },
];

export default function Login() {
  const [tab, setTab] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role, loading, error } = useSelector((s) => s.auth);
  const from = location.state?.from?.pathname || (tab === 'user' ? '/dashboard' : tab === 'admin' ? '/admin' : '/doctor');

  if (token && role) {
    const home = role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor' : '/dashboard';
    return <Navigate to={from || home} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    const action =
      tab === 'admin' ? adminLogin({ email, password }) : tab === 'doctor' ? doctorLogin({ email, password }) : loginUser({ email, password });
    dispatch(action).then((res) => {
      if (res.meta?.requestStatus === 'fulfilled') navigate(from, { replace: true });
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
        <p className="text-gray-600 mb-6">Choose your account type and sign in.</p>

        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); dispatch(clearError()); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                tab === t.id ? 'bg-white text-primary-600 shadow' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
          )}
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>

        {tab === 'user' && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        )}
      </Card>
    </div>
  );
}
