import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getAuthConfig } from '../../api/api.js';

export const bookAppointment = createAsyncThunk(
  'appointments/book',
  async (body, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.post('/appointment/book', body, config);
      return data?.appointment ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getUserAppointments = createAsyncThunk(
  'appointments/getUserAppointments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.get('/appointment/usersAppointments', config);
      return data?.appointments ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getDoctorAppointments = createAsyncThunk(
  'appointments/getDoctorAppointments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.get('/appointment/doctorsAppointments', config);
      return data?.appointments ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getAllAppointments = createAsyncThunk(
  'appointments/getAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.get('/appointment/all', config);
      return data?.appointments ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const respondToAppointment = createAsyncThunk(
  'appointments/respond',
  async ({ appointmentId, response, rejectionReason }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const body = { appointmentId, response };
      if (response === 'Rejected' && rejectionReason != null) body.rejectionReason = rejectionReason;
      const { data } = await api.put('/appointment/respond', body, config);
      return data?.appointment ?? data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const sendEmailToAppointmentUser = createAsyncThunk(
  'appointments/sendEmail',
  async ({ appointmentId, subject, message }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      await api.post('/appointment/send-email', { appointmentId, subject, message }, config);
      return appointmentId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
  actionSuccess: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, { payload }) => {
      state.list = payload ?? state.list;
    },
    clearAppointmentError: (state) => {
      state.error = null;
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    builder
      .addCase(bookAppointment.pending, pending)
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.list = [action.payload, ...state.list];
        state.actionSuccess = 'Booked';
        state.error = null;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserAppointments.pending, pending)
      .addCase(getUserAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(getUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDoctorAppointments.pending, pending)
      .addCase(getDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(getDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllAppointments.pending, pending)
      .addCase(getAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(getAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(respondToAppointment.pending, (state) => {
        state.error = null;
      })
      .addCase(respondToAppointment.fulfilled, (state, action) => {
        const idx = state.list.findIndex((a) => a._id === action.payload?._id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.actionSuccess = 'Responded';
        state.error = null;
      })
      .addCase(respondToAppointment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(sendEmailToAppointmentUser.fulfilled, (state) => {
        state.actionSuccess = 'Email sent';
        state.error = null;
      })
      .addCase(sendEmailToAppointmentUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setAppointments, clearAppointmentError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
