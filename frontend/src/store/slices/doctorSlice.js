import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getAuthConfig } from '../../api/api.js';

export const getDoctors = createAsyncThunk(
  'doctors/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/doctors');
      return data?.doctors ?? data ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getDoctorById = createAsyncThunk(
  'doctors/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/doctors/${id}`);
      return data?.doctor ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createDoctor = createAsyncThunk(
  'doctors/create',
  async (body, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.post('/doctors/create', body, config);
      return data?.doctor ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateDoctor = createAsyncThunk(
  'doctors/update',
  async ({ id, ...body }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.put(`/doctors/${id}`, body, config);
      return data?.doctor ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  'doctors/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      await api.delete(`/doctors/${id}`, config);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    clearCurrentDoctor: (state) => {
      state.current = null;
    },
    clearDoctorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDoctorById.pending, (state) => { state.error = null; })
      .addCase(getDoctorById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = null;
      })
      .addCase(getDoctorById.rejected, (state, action) => { state.error = action.payload; })
      .addCase(createDoctor.fulfilled, (state, action) => {
        if (action.payload) state.list = [action.payload, ...state.list];
        state.error = null;
      })
      .addCase(createDoctor.rejected, (state, action) => { state.error = action.payload; })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const idx = state.list.findIndex((d) => d._id === action.payload?._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.current?._id === action.payload?._id) state.current = action.payload;
        state.error = null;
      })
      .addCase(updateDoctor.rejected, (state, action) => { state.error = action.payload; })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
        state.error = null;
      })
      .addCase(deleteDoctor.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearCurrentDoctor, clearDoctorError } = doctorSlice.actions;
export default doctorSlice.reducer;
