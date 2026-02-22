import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getAuthConfig } from '../../api/api.js';

export const getServices = createAsyncThunk(
  'services/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/services');
      return data?.services ?? data ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getSingleService = createAsyncThunk(
  'services/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/services/${id}`);
      return data?.service ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (body, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.post('/services/create', body, config);
      const service = data?.title ? data : data?.data;
      return service;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateService = createAsyncThunk(
  'services/update',
  async ({ id, ...body }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.put(`/services/${id}`, body, config);
      const service = data?.title ? data : data?.data;
      return service;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      await api.delete(`/services/${id}`, config);
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

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearCurrentService: (state) => {
      state.current = null;
    },
    clearServiceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getServices.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getServices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSingleService.pending, (state) => { state.error = null; })
      .addCase(getSingleService.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = null;
      })
      .addCase(getSingleService.rejected, (state, action) => { state.error = action.payload; })
      .addCase(createService.fulfilled, (state, action) => {
        if (action.payload) state.list = [action.payload, ...state.list];
        state.error = null;
      })
      .addCase(createService.rejected, (state, action) => { state.error = action.payload; })
      .addCase(updateService.fulfilled, (state, action) => {
        const idx = state.list.findIndex((s) => s._id === action.payload?._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.current?._id === action.payload?._id) state.current = action.payload;
        state.error = null;
      })
      .addCase(updateService.rejected, (state, action) => { state.error = action.payload; })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
        state.error = null;
      })
      .addCase(deleteService.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearCurrentService, clearServiceError } = serviceSlice.actions;
export default serviceSlice.reducer;
