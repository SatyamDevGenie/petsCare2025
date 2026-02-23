import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPetById } from '../store/slices/petSlice';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

export default function PetDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((s) => s.pets);

  useEffect(() => {
    if (id) dispatch(getPetById(id));
  }, [dispatch, id]);

  if (loading) return <Spinner className="py-20" />;
  if (error) return <div className="text-red-600 py-8">{error}</div>;
  if (!current) return null;

  const records = current.vaccinationRecords || [];

  return (
    <div>
      <Link to="/pets" className="text-primary-600 hover:underline mb-4 inline-block">← Back to all pets</Link>
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            {current.image ? (
              <div className="w-full md:w-80 h-80 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-contain object-center rounded-xl"
                />
              </div>
            ) : (
              <div className="w-full md:w-80 h-80 bg-primary-100 rounded-xl flex items-center justify-center text-8xl">🐾</div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{current.name}</h1>
            <p className="text-primary-600 font-medium mt-1">{current.type} • {current.breed}</p>
            <p className="text-gray-600 mt-2">Age: {current.age} • {current.gender}</p>
            {current.notes && (
              <p className="text-gray-600 mt-4">{current.notes}</p>
            )}
            {records.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold text-gray-900 mb-2">Vaccination records</h2>
                <ul className="space-y-2">
                  {records.map((r, i) => (
                    <li key={i} className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium text-gray-900">{r.vaccineName}</span>
                      {' • '}
                      {r.dateAdministered ? new Date(r.dateAdministered).toLocaleDateString() : '—'}
                      {r.nextDueDate && ` • Next: ${new Date(r.nextDueDate).toLocaleDateString()}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
