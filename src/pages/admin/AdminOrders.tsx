import { useEffect, useRef, useState } from 'react';
import { Bell, BellOff, ChevronDown } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const STATUS_COLORS: Record<string, string> = {
  new: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  confirmed: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  shipped: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  delivered: 'border-green-500/30 text-green-400 bg-green-500/10',
  cancelled: 'border-red-500/30 text-red-400 bg-red-500/10',
};
const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const prevCountRef = useRef(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async () => {
    try {
      const data = await adminApi.getOrders();
      const newCount = data.filter((o: any) => o.status === 'new').length;
      if (notifEnabled && newCount > prevCountRef.current && prevCountRef.current > 0) {
        new Notification('🛍️ New Order', { body: `You have ${newCount - prevCountRef.current} new order(s)!` });
      }
      prevCountRef.current = newCount;
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, 30000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [notifEnabled]);

  const enableNotifications = async () => {
    if (!('Notification' in window)) return alert('Browser notifications not supported');
    const perm = await Notification.requestPermission();
    if (perm === 'granted') setNotifEnabled(true);
    else alert('Notification permission denied');
  };

  const updateStatus = async (id: number, status: string) => {
    await adminApi.updateOrder(id, { status });
    load();
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const newCount = orders.filter(o => o.status === 'new').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl text-foreground tracking-wider">Orders</h1>
          {newCount > 0 && (
            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs px-2 py-0.5 rounded-full">
              {newCount} new
            </span>
          )}
        </div>
        <button
          onClick={notifEnabled ? () => setNotifEnabled(false) : enableNotifications}
          className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-sm transition-colors ${
            notifEnabled
              ? 'border-[hsl(43_76%_52%/0.5)] text-[hsl(43_76%_52%)] bg-[hsl(43_76%_52%/0.1)]'
              : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
          }`}
        >
          {notifEnabled ? <Bell size={15} /> : <BellOff size={15} />}
          {notifEnabled ? 'Notifications On' : 'Enable Notifications'}
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 text-xs border rounded-sm transition-colors capitalize ${
              filter === s
                ? 'bg-[hsl(43_76%_52%)] text-black border-[hsl(43_76%_52%)]'
                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
            }`}
          >{s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}</button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-sm">No orders found</div>
        ) : filtered.map(order => (
          <div key={order.id} className="bg-card border border-border rounded-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-muted-foreground text-sm">#{order.id}</span>
                <span className="font-medium text-foreground">{order.customerName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[order.status] || 'border-border text-muted-foreground'}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[hsl(43_76%_52%)] font-medium">{order.total} TL</span>
                <span className="text-xs text-muted-foreground hidden sm:block">{new Date(order.createdAt).toLocaleString()}</span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {expanded === order.id && (
              <div className="border-t border-border px-5 py-4 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Order Items</p>
                  <div className="space-y-2">
                    {(order.items as any[]).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-muted-foreground ml-2">{item.size} · {item.concentration} × {item.quantity}</span>
                        </div>
                        <span className="text-[hsl(43_76%_52%)]">{item.price * item.quantity} TL</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/50 mt-2">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-[hsl(43_76%_52%)] font-medium">{order.total} TL</span>
                  </div>
                </div>

                {order.whatsappPhone && (
                  <div>
                    <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">WhatsApp</p>
                    <a href={`https://wa.me/${order.whatsappPhone}`} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-green-400 hover:underline">+{order.whatsappPhone}</a>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Update Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {STATUSES.map(s => (
                      <button key={s} onClick={() => updateStatus(order.id, s)}
                        disabled={order.status === s}
                        className={`px-3 py-1.5 text-xs border rounded-sm transition-colors capitalize ${
                          order.status === s
                            ? `${STATUS_COLORS[s]} cursor-default`
                            : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
