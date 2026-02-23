import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyNotifications, markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

export default function Notifications() {
  const dispatch = useDispatch();
  const { list, unreadCount, loading, error } = useSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(getMyNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleMarkRead = (id) => dispatch(markAsRead(id));
  const handleMarkAllRead = () => dispatch(markAllAsRead());

  if (loading && (!list || list.length === 0)) return <Spinner className="py-20" />;
  if (error) return <div className="text-red-600 py-8">{error}</div>;

  const notifications = list || [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-slate-600">{unreadCount ?? 0} unread</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n._id}
            className={`${!n.read ? 'border-l-4 border-l-primary-500' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-900">{n.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                {n.actedBy && <p className="text-xs text-slate-500 mt-1">By: {n.actedBy}</p>}
                <p className="text-xs text-slate-400 mt-1">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                </p>
              </div>
              {!n.read && (
                <Button
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => handleMarkRead(n._id)}
                >
                  Mark read
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      {notifications.length === 0 && (
        <Card>
          <p className="text-slate-500 text-center py-8">No notifications.</p>
        </Card>
      )}
    </div>
  );
}
