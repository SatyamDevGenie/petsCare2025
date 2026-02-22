import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getAuthConfig } from '../../api/api.js';

export const getMyNotifications = createAsyncThunk(
  'notifications/getMy',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.get('/notifications', config);
      return { list: data?.notifications ?? [], unreadCount: data?.unreadCount ?? 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await api.patch(`/notifications/${id}/read`, {}, config);
      return data?.notification ?? { _id: id, read: true };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      await api.patch('/notifications/read-all', {}, config);
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  list: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, { payload }) => {
      state.unreadCount = payload;
    },
    addNotification: (state, { payload }) => {
      if (payload) state.list = [payload, ...state.list];
      state.unreadCount += 1;
    },
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.unreadCount = action.payload.unreadCount;
        state.error = null;
      })
      .addCase(getMyNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const n = action.payload;
        const idx = state.list.findIndex((x) => x._id === n?._id);
        if (idx !== -1) state.list[idx].read = true;
        if (state.unreadCount > 0) state.unreadCount -= 1;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.list.forEach((n) => (n.read = true));
        state.unreadCount = 0;
      });
  },
});

export const { setUnreadCount, addNotification, clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
