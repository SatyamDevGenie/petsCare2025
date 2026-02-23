import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { useSocket } from './hooks/useSocket';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import Pets from './pages/Pets';
import PetDetail from './pages/PetDetail';

import PetOwnerDashboard from './pages/petowner/Dashboard';
import BookAppointment from './pages/petowner/BookAppointment';
import MyAppointments from './pages/petowner/MyAppointments';
import Notifications from './pages/petowner/Notifications';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';

import AdminDashboard from './pages/admin/AdminDashboard';
import AllAppointments from './pages/admin/AllAppointments';
import PetsManage from './pages/admin/PetsManage';
import ServicesManage from './pages/admin/ServicesManage';
import DoctorsManage from './pages/admin/DoctorsManage';

function AppRoutes() {
  useSocket();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/pets/:id" element={<PetDetail />} />

        <Route path="/dashboard" element={<ProtectedRoute allowedRole="user"><PetOwnerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/book" element={<ProtectedRoute allowedRole="user"><BookAppointment /></ProtectedRoute>} />
        <Route path="/dashboard/appointments" element={<ProtectedRoute allowedRole="user"><MyAppointments /></ProtectedRoute>} />
        <Route path="/dashboard/notifications" element={<ProtectedRoute allowedRole="user"><Notifications /></ProtectedRoute>} />

        <Route path="/doctor" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute allowedRole="doctor"><DoctorAppointments /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute allowedRole="admin"><AllAppointments /></ProtectedRoute>} />
        <Route path="/admin/pets" element={<ProtectedRoute allowedRole="admin"><PetsManage /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute allowedRole="admin"><ServicesManage /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute allowedRole="admin"><DoctorsManage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
