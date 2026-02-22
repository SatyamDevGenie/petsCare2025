import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getAuthConfig } from '../../api/api.js';

export const getPets = createAsyncThunk(
  'pets/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/pets');
      return data?.data ?? data?.pets ?? data ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getPetById = createAsyncThunk(
  'pets/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/pets/${id}`);
      return data?.data ?? data?.pet ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createPet = createAsyncThunk(
  'pets/create',
  async (body, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.post('/pets/create', body, config);
      return data?.data ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updatePet = createAsyncThunk(
  'pets/update',
  async ({ id, ...body }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.put(`/pets/${id}`, body, config);
      return data?.data ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deletePet = createAsyncThunk(
  'pets/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      await api.delete(`/pets/${id}`, config);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getVaccinationRecords = createAsyncThunk(
  'pets/vaccinationRecords',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.get(`/pets/${id}/vaccination-records`, config);
      return { petId: id, records: data?.data ?? data?.vaccinationRecords ?? [] };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  list: [],
  current: null,
  vaccinationRecords: [],
  loading: false,
  error: null,
};

const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    clearCurrentPet: (state) => {
      state.current = null;
      state.vaccinationRecords = [];
    },
    clearPetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPets.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getPets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getPets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPetById.pending, (state) => { state.error = null; })
      .addCase(getPetById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = null;
      })
      .addCase(getPetById.rejected, (state, action) => { state.error = action.payload; })
      .addCase(createPet.fulfilled, (state, action) => {
        if (action.payload) state.list = [action.payload, ...state.list];
        state.error = null;
      })
      .addCase(createPet.rejected, (state, action) => { state.error = action.payload; })
      .addCase(updatePet.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload?._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.current?._id === action.payload?._id) state.current = action.payload;
        state.error = null;
      })
      .addCase(updatePet.rejected, (state, action) => { state.error = action.payload; })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
        state.error = null;
      })
      .addCase(deletePet.rejected, (state, action) => { state.error = action.payload; })
      .addCase(getVaccinationRecords.fulfilled, (state, action) => {
        state.vaccinationRecords = action.payload?.records ?? [];
        state.error = null;
      })
      .addCase(getVaccinationRecords.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearCurrentPet, clearPetError } = petSlice.actions;
export default petSlice.reducer;
