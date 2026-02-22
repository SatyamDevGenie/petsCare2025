import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor, clearDoctorError } from '../../store/slices/doctorSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { uploadImage } from '../../api/upload';

export default function DoctorsManage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.doctors);
  const [modal, setModal] = useState({ open: false, edit: null });
  const [form, setForm] = useState({
    name: '', email: '', password: '', specialization: '', contactNumber: '', notes: '', profileImage: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  const openAdd = () => {
    setForm({ name: '', email: '', password: '', specialization: '', contactNumber: '', notes: '', profileImage: '' });
    setModal({ open: true, edit: null });
    dispatch(clearDoctorError());
  };
  const openEdit = (d) => {
    setForm({
      name: d.name || '',
      email: d.email || '',
      password: '',
      specialization: d.specialization || '',
      contactNumber: d.contactNumber || '',
      notes: d.notes || '',
      profileImage: d.profileImage || '',
    });
    setModal({ open: true, edit: d });
    dispatch(clearDoctorError());
  };
  const onProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, profileImage: url }));
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };
  const closeModal = () => setModal({ open: false, edit: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modal.edit) {
      const payload = { id: modal.edit._id, name: form.name, email: form.email, specialization: form.specialization, contactNumber: form.contactNumber, notes: form.notes, profileImage: form.profileImage || undefined };
      if (form.password) payload.password = form.password;
      dispatch(updateDoctor(payload)).then((r) => r.meta?.requestStatus === 'fulfilled' && closeModal());
    } else {
      if (!form.password) return;
      dispatch(createDoctor(form)).then((r) => r.meta?.requestStatus === 'fulfilled' && closeModal());
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this doctor?')) dispatch(deleteDoctor(id));
  };

  if (loading && (!list || list.length === 0)) return <Spinner className="py-20" />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-600">Add, edit, or remove doctors.</p>
        </div>
        <Button onClick={openAdd}>Add Doctor</Button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(list || []).map((d) => (
          <Card key={d._id}>
            <div className="flex items-start gap-4">
              {d.profileImage ? (
                <img src={d.profileImage} alt="" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl">👨‍⚕️</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{d.name}</h3>
                <p className="text-sm text-primary-600">{d.specialization}</p>
                <p className="text-sm text-gray-500 truncate">{d.email}</p>
                {d.contactNumber && <p className="text-sm text-gray-500">{d.contactNumber}</p>}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" onClick={() => openEdit(d)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDelete(d._id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
      {(!list || list.length === 0) && !loading && (
        <Card><p className="text-gray-500 text-center py-8">No doctors. Add one above.</p></Card>
      )}

      <Modal open={modal.open} onClose={closeModal} title={modal.edit ? 'Edit Doctor' : 'Add Doctor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            disabled={!!modal.edit}
          />
          <Input
            label={modal.edit ? 'New password (leave blank to keep)' : 'Password'}
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required={!modal.edit}
          />
          <Input label="Specialization" value={form.specialization} onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))} required />
          <Input label="Contact number" value={form.contactNumber} onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile image (optional)</label>
            <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={onProfileImageUpload} disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-50 file:text-primary-700" />
            {form.profileImage && <p className="mt-1 text-xs text-gray-500 truncate">{form.profileImage}</p>}
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{modal.edit ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
