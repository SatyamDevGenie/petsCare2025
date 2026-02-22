import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentReducer from './slices/appointmentSlice';
import notificationReducer from './slices/notificationSlice';
import serviceReducer from './slices/serviceSlice';
import doctorReducer from './slices/doctorSlice';
import petReducer from './slices/petSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentReducer,
    notifications: notificationReducer,
    services: serviceReducer,
    doctors: doctorReducer,
    pets: petReducer,
  },
});
