import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPets, createPet, updatePet, deletePet, getVaccinationRecords, clearPetError } from '../../store/slices/petSlice';
import { uploadImage } from '../../api/upload';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Other'];
const GENDERS = ['Male', 'Female'];

export default function PetsManage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.pets);
  const [modal, setModal] = useState({ open: false, edit: null });
  const [vaccModal, setVaccModal] = useState({ open: false, petId: null, petName: '' });
  const [form, setForm] = useState({ name: '', type: 'Dog', breed: '', age: '', gender: 'Male', notes: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const { vaccinationRecords } = useSelector((s) => s.pets);

  useEffect(() => {
    dispatch(getPets());
  }, [dispatch]);

  const openAdd = () => {
    setForm({ name: '', type: 'Dog', breed: '', age: '', gender: 'Male', notes: '', image: '' });
    setModal({ open: true, edit: null });
    dispatch(clearPetError());
  };
  const openEdit = (p) => {
    setForm({
      name: p.name,
      type: p.type || 'Dog',
      breed: p.breed || '',
      age: p.age ?? '',
      gender: p.gender || 'Male',
      notes: p.notes || '',
      image: p.image || '',
    });
    setModal({ open: true, edit: p });
    dispatch(clearPetError());
  };
  const onImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };
  const closeModal = () => setModal({ open: false, edit: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, age: Number(form.age), image: form.image || undefined };
    if (modal.edit) {
      dispatch(updatePet({ id: modal.edit._id, ...payload })).then((r) => r.meta?.requestStatus === 'fulfilled' && closeModal());
    } else {
      dispatch(createPet(payload)).then((r) => r.meta?.requestStatus === 'fulfilled' && closeModal());
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this pet?')) dispatch(deletePet(id));
  };

  const openVacc = (pet) => {
    setVaccModal({ open: true, petId: pet._id, petName: pet.name });
    dispatch(getVaccinationRecords(pet._id));
  };
  const closeVacc = () => setVaccModal({ open: false, petId: null, petName: '' });

  if (loading && (!list || list.length === 0)) return <Spinner className="py-20" />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Pets</h1>
          <p className="text-gray-600">Add, edit, or remove pets.</p>
        </div>
        <Button onClick={openAdd}>Add Pet</Button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(list || []).map((p) => (
          <Card key={p._id}>
            {p.image ? (
              <img src={p.image} alt="" className="w-full h-32 object-cover rounded-t-lg -m-6 mb-4" />
            ) : (
              <div className="w-full h-32 bg-primary-100 rounded-t-lg -m-6 mb-4 flex items-center justify-center text-4xl">🐾</div>
            )}
            <h3 className="font-semibold text-gray-900">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.type} • {p.breed} • {p.age} yrs • {p.gender}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => openEdit(p)}>Edit</Button>
              <Button variant="outline" onClick={() => openVacc(p)}>Vaccination</Button>
              <Button variant="danger" onClick={() => handleDelete(p._id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
      {(!list || list.length === 0) && !loading && (
        <Card><p className="text-gray-500 text-center py-8">No pets. Add one above.</p></Card>
      )}

      <Modal open={vaccModal.open} onClose={closeVacc} title={`Vaccination records – ${vaccModal.petName}`}>
        <div className="space-y-2">
          {(vaccinationRecords || []).length === 0 && <p className="text-gray-500 text-sm">No vaccination records.</p>}
          {(vaccinationRecords || []).map((r, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium text-gray-900">{r.vaccineName}</p>
              <p className="text-gray-600">Date: {r.dateAdministered ? new Date(r.dateAdministered).toLocaleDateString() : '—'}</p>
              {r.nextDueDate && <p className="text-gray-500">Next: {new Date(r.nextDueDate).toLocaleDateString()}</p>}
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={modal.open} onClose={closeModal} title={modal.edit ? 'Edit Pet' : 'Add Pet'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {PET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Breed" value={form.breed} onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))} required />
          <Input label="Age" type="number" min="0" value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <Input label="Notes (optional)" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
            <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={onImageUpload} disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-50 file:text-primary-700" />
            {form.image && <p className="mt-1 text-xs text-gray-500 truncate">{form.image}</p>}
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
