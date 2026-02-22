import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../store/slices/notificationSlice';
import { getUserAppointments } from '../store/slices/appointmentSlice';

const socketUrl = import.meta.env.VITE_WS_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

export function useSocket() {
  const dispatch = useDispatch();
  const { token, role } = useSelector((s) => s.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || role !== 'user') return;

    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('appointment_response', (payload) => {
      dispatch(addNotification({
        _id: `socket-${Date.now()}`,
        title: payload.title || 'Appointment update',
        message: payload.message || '',
        actedBy: payload.actedBy,
        read: false,
      }));
      dispatch(getUserAppointments());
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, role, dispatch]);
}
