import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getAuthConfig } from '../../api/api.js';

const persistAuth = (userOrDoctor, role) => {
  const key = 'petscare_auth';
  try {
    const payload = userOrDoctor ? { ...userOrDoctor, _role: role } : null;
    if (payload) localStorage.setItem(key, JSON.stringify(payload));
    else localStorage.removeItem(key);
  } catch (e) {}
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/register', body);
      const user = data?.data || data;
      const token = user?.token;
      const profile = { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token };
      persistAuth(profile, 'user');
      return { user: profile, role: 'user' };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      const user = data?.user || data;
      persistAuth(user, 'user');
      return { user, role: 'user' };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users/admin/login', { email, password });
      const user = { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin, token: data.token };
      persistAuth(user, 'admin');
      return { user, role: 'admin' };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const doctorLogin = createAsyncThunk(
  'auth/doctorLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/doctors/doctorLogin', { email, password });
      const doctor = data?.doctor || data;
      persistAuth(doctor, 'doctor');
      return { doctor, role: 'doctor' };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const config = getAuthConfig(getState);
    try {
      await api.post('/users/logout', {}, config);
    } catch (_) {}
    persistAuth(null);
    return null;
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.get('/users/profile', config);
      const user = data?.user || data;
      return { user, role: getState().auth.role || 'user' };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (body, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.put('/users/profile', body, config);
      const user = data?.user || data;
      persistAuth({ ...user, token: user.token || getState().auth?.user?.token }, getState().auth.role);
      return { user, role: getState().auth.role || 'user' };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const loadStored = () => {
  try {
    const raw = localStorage.getItem('petscare_auth');
    if (!raw) return { user: null, doctor: null, role: null, token: null };
    const parsed = JSON.parse(raw);
    const role = parsed._role || 'user';
    const token = parsed.token;
    if (role === 'doctor') return { doctor: parsed, user: null, role: 'doctor', token };
    return { user: parsed, doctor: null, role: role === 'admin' ? 'admin' : 'user', token };
  } catch (e) {
    return { user: null, doctor: null, role: null, token: null };
  }
};

const initialState = {
  ...loadStored(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, { payload }) => {
      if (payload?.user) state.user = payload.user;
      if (payload?.doctor) state.doctor = payload.doctor;
      if (payload?.role) state.role = payload.role;
      if (payload?.token) state.token = payload.token;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state, action) => {
      state.loading = action.meta?.requestStatus === 'pending';
      state.error = action.meta?.requestStatus === 'rejected' ? action.payload : null;
    };
    [registerUser, loginUser, adminLogin, doctorLogin, getProfile, updateProfile].forEach((thunk) => {
      builder.addCase(thunk.pending, setLoading);
      builder.addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
    });
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.doctor = null;
        state.role = action.payload.role;
        state.token = action.payload.user?.token;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.doctor = null;
        state.role = action.payload.role;
        state.token = action.payload.user?.token;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.doctor = null;
        state.role = 'admin';
        state.token = action.payload.user?.token;
        state.error = null;
      })
      .addCase(doctorLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.doctor = action.payload.doctor;
        state.role = 'doctor';
        state.token = action.payload.doctor?.token;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.doctor = null;
        state.role = null;
        state.token = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) state.user = { ...state.user, ...action.payload.user };
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.user?.token ?? state.token;
        state.error = null;
      });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
