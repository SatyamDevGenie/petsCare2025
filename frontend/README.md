# PetsCare Frontend

React + Vite + Tailwind CSS + **Redux Toolkit**.

## Redux Toolkit – State Management

The app uses **@reduxjs/toolkit** for all global state and API calls.

### Store structure

- **auth** – User/Doctor/Admin login, register, profile, logout
- **appointments** – Book, list (user/doctor/admin), respond (doctor), send email (admin)
- **notifications** – List, mark read, mark all read
- **services** – List, single, create, update, delete (admin)
- **doctors** – List, single, create, update, delete (admin)
- **pets** – List, single, create, update, delete, vaccination records (admin)

### Usage in components

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { getServices } from '../store/slices/serviceSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { user, role, loading, error } = useSelector((s) => s.auth);
  const services = useSelector((s) => s.services.list);

  const handleLogin = () => {
    dispatch(loginUser({ email: 'a@b.com', password: 'secret' }));
  };

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return <div>...</div>;
}
```

### Auth token

Protected API calls use the token from the store. Token is persisted in `localStorage` under `petscare_auth` and restored on reload. Use `getAuthConfig(getState)` from `src/api/api.js` when making custom authenticated requests.

### Scripts

- `npm run dev` – Start dev server (port 5173, proxies `/api` and `/uploads` to backend)
- `npm run build` – Production build
- `npm run preview` – Preview production build
