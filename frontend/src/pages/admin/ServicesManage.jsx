import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getServices, createService, updateService, deleteService, clearServiceError } from '../../store/slices/serviceSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';

export default function ServicesManage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.services);
  const [modal, setModal] = useState({ open: false, edit: null });
  const [form, setForm] = useState({ title: '', description: '', price: '' });

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const openAdd = () => {
    setForm({ title: '', description: '', price: '' });
    setModal({ open: true, edit: null });
    dispatch(clearServiceError());
  };
  const openEdit = (s) => {
    setForm({ title: s.title || '', description: s.description || '', price: s.price ?? '' });
    setModal({ open: true, edit: s });
    dispatch(clearServiceError());
  };
  const closeModal = () => setModal({ open: false, edit: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) || 0 };
    if (modal.edit) {
      dispatch(updateService({ id: modal.edit._id, ...payload })).then((r) => {
        if (r.meta?.requestStatus === 'fulfilled') {
          toast.success('Service updated');
          closeModal();
        }
      });
    } else {
      dispatch(createService(payload)).then((r) => {
        if (r.meta?.requestStatus === 'fulfilled') {
          toast.success('Service added');
          closeModal();
        }
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service?')) {
      dispatch(deleteService(id)).then((r) => r.meta?.requestStatus === 'fulfilled' && toast.success('Service removed'));
    }
  };

  if (loading && (!list || list.length === 0)) return <Spinner className="py-20" />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Services</h1>
          <p className="text-slate-600">Add, edit, or remove services.</p>
        </div>
        <Button onClick={openAdd}>Add Service</Button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <div className="space-y-4">
        {(list || []).map((s) => (
          <Card key={s._id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{s.description}</p>
                <p className="text-primary-600 font-medium mt-1">₹{s.price ?? '—'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => openEdit(s)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(s._id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {(!list || list.length === 0) && !loading && (
        <Card><p className="text-slate-500 text-center py-8">No services. Add one above.</p></Card>
      )}

      <Modal open={modal.open} onClose={closeModal} title={modal.edit ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <Input label="Price (₹)" type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{modal.edit ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
