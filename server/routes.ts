import { Express, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { eq, desc, and, or, isNull, lte, gte } from 'drizzle-orm';
import { db } from './db';
import { adminUsers, perfumes, offers, orders, siteSettings } from '../shared/schema';
import { signToken, requireAuth } from './auth';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export function registerRoutes(app: Express) {

  // ─── Public: Perfumes ────────────────────────────────────────────────
  app.get('/api/perfumes', async (_req, res) => {
    try {
      const rows = await db.select().from(perfumes)
        .where(eq(perfumes.active, true))
        .orderBy(perfumes.sortOrder, perfumes.createdAt);
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  app.get('/api/perfumes/:id', async (req, res) => {
    try {
      const [row] = await db.select().from(perfumes).where(eq(perfumes.id, req.params.id));
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(row);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  // ─── Public: Active Offers ────────────────────────────────────────────
  app.get('/api/offers', async (_req, res) => {
    try {
      const now = new Date();
      const rows = await db.select().from(offers).where(eq(offers.active, true));
      const active = rows.filter(o => {
        if (o.startDate && o.startDate > now) return false;
        if (o.endDate && o.endDate < now) return false;
        return true;
      });
      res.json(active);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  // ─── Public: Site Settings ────────────────────────────────────────────
  app.get('/api/settings', async (_req, res) => {
    try {
      const rows = await db.select().from(siteSettings);
      const map: Record<string, any> = {};
      rows.forEach(r => { map[r.key] = r.value; });
      res.json(map);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  // ─── Public: Create Order ─────────────────────────────────────────────
  app.post('/api/orders', async (req, res) => {
    try {
      const { customerName, whatsappPhone, items, subtotal, discountAmount, total } = req.body;
      if (!customerName || !items || !total) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const [order] = await db.insert(orders).values({
        customerName,
        whatsappPhone: whatsappPhone || '',
        items,
        subtotal: subtotal || total,
        discountAmount: discountAmount || 0,
        total,
        status: 'new',
      }).returning();
      res.status(201).json(order);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'DB error' });
    }
  });

  // ─── Admin: Auth ──────────────────────────────────────────────────────
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
      const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
      const token = signToken({ id: user.id, username: user.username });
      res.json({ token, username: user.username });
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  app.get('/api/admin/me', requireAuth, (req, res) => {
    res.json({ username: (req as any).admin.username });
  });

  // ─── Admin: Perfumes ──────────────────────────────────────────────────
  app.get('/api/admin/perfumes', requireAuth, async (_req, res) => {
    try {
      const rows = await db.select().from(perfumes).orderBy(perfumes.sortOrder, perfumes.createdAt);
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  app.post('/api/admin/perfumes', requireAuth, async (req, res) => {
    try {
      const data = req.body;
      const [row] = await db.insert(perfumes).values({
        ...data,
        updatedAt: new Date(),
      }).returning();
      res.status(201).json(row);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put('/api/admin/perfumes/:id', requireAuth, async (req, res) => {
    try {
      const { id, createdAt, ...data } = req.body;
      const [row] = await db.update(perfumes)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(perfumes.id, req.params.id))
        .returning();
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(row);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/admin/perfumes/:id', requireAuth, async (req, res) => {
    try {
      await db.delete(perfumes).where(eq(perfumes.id, req.params.id));
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  // ─── Admin: Offers ────────────────────────────────────────────────────
  app.get('/api/admin/offers', requireAuth, async (_req, res) => {
    try {
      const rows = await db.select().from(offers).orderBy(desc(offers.createdAt));
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  app.post('/api/admin/offers', requireAuth, async (req, res) => {
    try {
      const { type, targetValue, label, discountPercent, startDate, endDate, active } = req.body;
      const [row] = await db.insert(offers).values({
        type, targetValue, label,
        discountPercent: parseInt(discountPercent),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        active: active ?? true,
      }).returning();
      res.status(201).json(row);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put('/api/admin/offers/:id', requireAuth, async (req, res) => {
    try {
      const { id, createdAt, ...data } = req.body;
      const [row] = await db.update(offers)
        .set({
          ...data,
          discountPercent: data.discountPercent ? parseInt(data.discountPercent) : undefined,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
        })
        .where(eq(offers.id, parseInt(req.params.id)))
        .returning();
      res.json(row);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/admin/offers/:id', requireAuth, async (req, res) => {
    try {
      await db.delete(offers).where(eq(offers.id, parseInt(req.params.id)));
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  // ─── Admin: Orders ────────────────────────────────────────────────────
  app.get('/api/admin/orders', requireAuth, async (req, res) => {
    try {
      const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  app.put('/api/admin/orders/:id', requireAuth, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const [row] = await db.update(orders)
        .set({ status, notes, updatedAt: new Date() })
        .where(eq(orders.id, parseInt(req.params.id)))
        .returning();
      res.json(row);
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });

  // ─── Admin: Settings ──────────────────────────────────────────────────
  app.put('/api/admin/settings', requireAuth, async (req, res) => {
    try {
      const settings = req.body as Record<string, any>;
      for (const [key, value] of Object.entries(settings)) {
        await db.insert(siteSettings)
          .values({ key, value, updatedAt: new Date() })
          .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
      }
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ─── Admin: Upload ────────────────────────────────────────────────────
  app.post('/api/admin/upload', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  // ─── Admin: Dashboard Stats ───────────────────────────────────────────
  app.get('/api/admin/stats', requireAuth, async (_req, res) => {
    try {
      const allPerfumes = await db.select().from(perfumes);
      const allOrders = await db.select().from(orders);
      const allOffers = await db.select().from(offers);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = allOrders.filter(o => o.createdAt >= today);
      res.json({
        totalPerfumes: allPerfumes.length,
        activePerfumes: allPerfumes.filter(p => p.active).length,
        totalOrders: allOrders.length,
        newOrders: allOrders.filter(o => o.status === 'new').length,
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((s, o) => s + o.total, 0),
        activeOffers: allOffers.filter(o => o.active).length,
      });
    } catch (e) {
      res.status(500).json({ error: 'DB error' });
    }
  });
}
