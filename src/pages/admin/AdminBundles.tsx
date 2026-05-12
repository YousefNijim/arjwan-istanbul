import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '@/lib/adminApi';
import { Plus, Edit2, ExternalLink } from 'lucide-react';

const AdminBundles = () => {
  const navigate = useNavigate();
  const [bundleConfigs, setBundleConfigs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then(data => {
      setBundleConfigs(data?.bundleConfigs || {});
    }).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    const slug = newId.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!slug) return;
    setCreating(true);
    try {
      const current = await adminApi.getSettings();
      const configs = { ...(current.bundleConfigs || {}) };
      if (!configs[slug]) configs[slug] = { title: slug };
      await adminApi.updateSettings({ ...current, bundleConfigs: configs });
      navigate(`/admin/bundles/${slug}`);
    } finally {
      setCreating(false);
    }
  };

  const entries = Object.entries(bundleConfigs);

  if (loading) return <div className="text-muted-foreground py-12 text-center">Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-foreground tracking-wider">Bundles</h1>
          <p className="text-muted-foreground/50 text-xs mt-1">Manage all bundle pages</p>
        </div>
      </div>

      {/* Bundle list */}
      {entries.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center mb-6">
          <p className="text-muted-foreground/50 text-sm">No bundles yet. Create your first one below.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          {entries.map(([id, config]) => (
            <div
              key={id}
              className="flex items-center justify-between bg-card border border-border rounded-sm px-5 py-4 hover:border-[hsl(43_76%_52%/0.4)] transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{config.title || id}</p>
                <p className="text-xs text-muted-foreground/50 mt-0.5">/bundles/{id}</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/bundles/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="View page"
                >
                  <ExternalLink size={14} />
                </a>
                <Link
                  to={`/admin/bundles/${id}`}
                  className="flex items-center gap-1.5 text-xs bg-secondary border border-border px-3 py-1.5 text-muted-foreground hover:border-[hsl(43_76%_52%)] hover:text-foreground transition-colors"
                >
                  <Edit2 size={12} /> Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create new bundle */}
      <div className="bg-card border border-border rounded-sm p-6">
        <h2 className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Create New Bundle</h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              value={newId}
              onChange={e => setNewId(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreate(); } }}
              placeholder="Bundle ID — e.g. summer-trio"
              className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(43_76%_52%)] transition-colors"
            />
            <p className="text-xs text-muted-foreground/40 mt-1">
              Lowercase letters, numbers, and hyphens only. This becomes the URL: /bundles/<span className="text-muted-foreground/60">{newId || 'your-id'}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || !newId.trim()}
            className="flex items-center gap-2 bg-[hsl(43_76%_52%)] text-black px-5 py-2 text-sm tracking-widest uppercase font-medium hover:bg-[hsl(43_76%_60%)] transition-colors disabled:opacity-50 self-start"
          >
            <Plus size={14} />
            {creating ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBundles;
