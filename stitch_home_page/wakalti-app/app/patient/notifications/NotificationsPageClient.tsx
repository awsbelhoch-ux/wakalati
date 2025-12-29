'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'medication' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, unknown>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('فشل في تحميل الإشعارات');
      
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في التحميل';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('فشل في تحديث الإشعار');
      
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في العملية';
      toast.error(errorMessage);
    }
  }, [toast]);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('فشل في تحديث الإشعارات');
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('تم وضع علامة على جميع الإشعارات كمقروءة');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في العملية';
      toast.error(errorMessage);
    }
  }, [toast]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('فشل في حذف الإشعار');
      
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('تم حذف الإشعار');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في العملية';
      toast.error(errorMessage);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let socket: any;

    // Dynamic import so SSR / test environments that don't bundle socket.io-client won't fail
    (async () => {
      try {
        const mod = await import('socket.io-client');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { io } = mod as any;
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        // Use the ws-server origin directly if available
        const origin = new URL(base).origin || 'http://localhost:4000';
        socket = io(origin, { transports: ['websocket'] });

        if (socket && socket.on) {
          socket.on('notification', (payload: unknown) => {
            if (payload && typeof payload === 'object') {
              const p = payload as Record<string, unknown>;
              setNotifications(prev => [{
                id: (p.id as string) || `ntf-${Date.now()}`,
                type: (p.type as Notification['type']) || 'info',
                title: (p.title as string) || 'Notification',
                message: (p.body as string) || (p.message as string) || '',
                timestamp: new Date().toISOString(),
                read: false,
                data: (p.data as Record<string, unknown>) || {}
              }, ...prev]);
            }
          });
        }
      } catch {
        // noop - socket client not available in this environment
      }
    })();

    return () => {
      if (socket && socket.disconnect) socket.disconnect();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// Component لعرض جرس الإشعارات
export function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showPanel && <NotificationPanel onClose={() => setShowPanel(false)} />}
    </div>
  );
}

// Panel لعرض الإشعارات
function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-900">الإشعارات ({unreadCount})</h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary hover:underline"
          >
            وضع علامة على الكل
          </button>
        )}
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Bell className="w-12 h-12 mx-auto opacity-20 mb-2" />
            <p>لا توجد إشعارات</p>
          </div>
        ) : (
          <>
            {unreadNotifications.length > 0 && (
              <>
                <div className="px-4 py-2 bg-blue-50 text-xs font-bold text-slate-600">
                  جديدة
                </div>
                {unreadNotifications.map(notif => (
                  <NotificationItem key={notif.id} notification={notif} />
                ))}
              </>
            )}

            {readNotifications.length > 0 && (
              <>
                <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-600 mt-4">
                  سابقة
                </div>
                {readNotifications.map(notif => (
                  <NotificationItem key={notif.id} notification={notif} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Component لعرض إشعار واحد
function NotificationItem({ notification }: { notification: Notification }) {
  const { markAsRead, deleteNotification } = useNotifications();
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'message': return <Bell className="w-5 h-5 text-green-600" />;
      case 'medication': return <CheckCircle className="w-5 h-5 text-amber-600" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div
      className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex gap-3">
        {getIcon(notification.type)}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 text-sm">{notification.title}</h4>
            <button
              onClick={() => deleteNotification(notification.id)}
              className="text-slate-400 hover:text-red-500 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-400">
              {new Date(notification.timestamp).toLocaleDateString('ar-SA')}
            </span>
            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="text-xs text-primary hover:underline"
              >
                وضع علامة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// صفحة الإشعارات الكاملة
export default function NotificationsPageClient() {
  const { notifications, loading } = useNotifications();

  if (loading) {
    return <LoadingSpinner fullScreen text="جاري تحميل الإشعارات..." />;
  }

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-[family-name:var(--font-cairo)]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">الإشعارات</h1>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        <Breadcrumb
          items={[
            { label: 'الرئيسية', href: '/patient/dashboard' },
            { label: 'الإشعارات' },
          ]}
        />

        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
            <Bell className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 font-medium">لا توجد إشعارات</p>
          </div>
        ) : (
          <>
            {unreadNotifications.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">
                    إشعارات جديدة ({unreadNotifications.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {unreadNotifications.map(notif => (
                    <NotificationCard key={notif.id} notification={notif} />
                  ))}
                </div>
              </section>
            )}

            {readNotifications.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-base font-bold text-slate-900">
                  إشعارات سابقة ({readNotifications.length})
                </h2>
                <div className="space-y-3">
                  {readNotifications.map(notif => (
                    <NotificationCard key={notif.id} notification={notif} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function NotificationCard({ notification }: { notification: Notification }) {
  const { markAsRead, deleteNotification } = useNotifications();

  const getIcon = (type: string) => {
    const iconProps = { className: 'w-6 h-6' };
    switch (type) {
      case 'appointment': return <Clock {...iconProps} className="w-6 h-6 text-blue-600" />;
      case 'message': return <Bell {...iconProps} className="w-6 h-6 text-green-600" />;
      case 'medication': return <CheckCircle {...iconProps} className="w-6 h-6 text-amber-600" />;
      case 'alert': return <AlertCircle {...iconProps} className="w-6 h-6 text-red-600" />;
      default: return <Info {...iconProps} className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-slate-100 ${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900">{notification.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
            <span className="text-xs text-slate-400">
              {new Date(notification.timestamp).toLocaleDateString('ar-SA')}
            </span>
            <div className="flex gap-2">
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-primary hover:bg-primary/10 px-2 py-1 rounded transition-colors"
                >
                  وضع علامة
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="text-xs text-slate-400 hover:text-red-500 px-2 py-1 rounded transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
