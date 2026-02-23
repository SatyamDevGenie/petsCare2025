import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getServices } from '../store/slices/serviceSlice';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

export default function Services() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.services);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  if (loading) return <Spinner className="py-20" />;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Our Services</h1>
      <p className="text-slate-600 mb-8">Healthcare and wellness for your pets.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(list || []).map((s) => (
          <Link key={s._id} to={`/services/${s._id}`}>
            <Card className="h-full hover:shadow-md hover:border-primary-200 transition">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">{s.title}</h2>
              <p className="text-slate-600 text-sm line-clamp-2">{s.description}</p>
              <p className="mt-3 text-primary-600 font-semibold">₹{s.price ?? '—'}</p>
            </Card>
          </Link>
        ))}
      </div>
      {(!list || list.length === 0) && (
        <p className="text-slate-500 text-center py-12">No services available.</p>
      )}
    </div>
  );
}
