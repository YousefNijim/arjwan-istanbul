import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '@/lib/adminApi';
import { Plus, Edit2, ExternalLink, Trash2 } from 'lucide-react';

// Bundles that always appear in the list (built-in pages with defaults)
const BUILT_IN: Array<{ id: string; defaultTitle: string }> = [
  { id: 'couples-eid', defaultTitle: 'Eid Couples Collection' },
  { id: 'eid-triple',  defaultTitle: 'Eid Triple Collection'  },
];

const BUILT_IN_IDS = new Set(BUILT_IN.map(b => b.id));

const AdminBundles = () => {
  const navigate = useNavigate();
  const [bundleConfigs, setBundleConfigs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSettings().then(data => {
      setBundleConfigs(data?.bundleConfigs || {});
    }).finally(() => setLoading(false));
  }, []);

  // Merge built-in bundles + any custom ones not in the built-in list
  const allBundles = [
    ...BUILT_IN.map(({ id, defaultTitle }) => ({
      id,
      title: bundleConfigs[id]?.title || defaultTitle,
      isBuiltIn: true,
      configured: !!bundleConfigs[id],
    })),
    ...Object.entries(bundleConfigs)
      .filter(([id]) => !BUILT_IN_IDS.has(id))
      .map(([id, config]) => ({
        id,
        title: config.title || id,
        isBuiltIn: false,
        configured: true,
      })),
  ];

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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const current = await adminApi.getSettings();
      const configs = { ...(current.bundleConfigs || {}) };
      delete configs[id];
      await adminApi.updateSettings({ ...current, bundleConfigs: configs });
      setBundleConfigs(configs);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  if (loading) return <div className="text-muted-foreground py-12 text-center">Loading…</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-foreground tracking-wider">Bundles</h1>
        <p className="text-muted-foreground/50 text-xs mt-1">Manage all bundle pages</p>
      </div>

      {/* Bundle list */}
      <div className="space-y-2 mb-6">
        {allBundles.map(({ id, title, isBuiltIn, configured }) => (
          <div
            key={id}
            className="flex items-center justify-between bg-card border border-border rounded-sm px-5 py-4 hover:border-[hsl(43_76%_52%/0.4)] transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{title}</p>
                {isBuiltIn && !configured && (
                  <span className="text-[10px] tracking-widest uppercase text-muted-foreground/40 border border-border px-1.5 py-0.5">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground/50 mt-0.5">/bundles/{id}</p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/bundles/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
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

              {/* Delete / Confirm */}
              {confirmId === id ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    disabled={deletingId === id}
                    className="text-xs bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 px-3 py-1.5 transition-colors disabled:opacity-50"
                  >
                    {deletingId === id ? 'Deleting…' : 'Confirm'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="text-xs bg-secondary border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(id)}
                  className="text-muted-foreground/40 hover:text-red-400 transition-colors p-1"
                  title={isBuiltIn ? 'Reset to defaults' : 'Delete bundle'}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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
              Lowercase, numbers and hyphens only · URL: /bundles/<span className="text-muted-foreground/60">{newId || 'your-id'}</span>
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
