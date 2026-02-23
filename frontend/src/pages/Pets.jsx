import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPets } from '../store/slices/petSlice';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

export default function Pets() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.pets);

  useEffect(() => {
    dispatch(getPets());
  }, [dispatch]);

  if (loading) return <Spinner className="py-20" />;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pets</h1>
      <p className="text-gray-600 mb-8">Pets in our care.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(list || []).map((p) => (
          <Link key={p._id} to={`/pets/${p._id}`}>
            <Card className="overflow-hidden h-full hover:shadow-md hover:border-primary-200 transition">
              {p.image ? (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain object-center" />
                </div>
              ) : (
                <div className="w-full h-48 bg-primary-100 flex items-center justify-center text-5xl">🐾</div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
                <p className="text-sm text-gray-600">{p.type} • {p.breed}</p>
                <p className="text-sm text-gray-500">Age: {p.age} • {p.gender}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {(!list || list.length === 0) && (
        <p className="text-gray-500 text-center py-12">No pets listed.</p>
      )}
    </div>
  );
}
