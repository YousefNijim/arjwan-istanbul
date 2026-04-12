import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { registerRoutes } from '../server/routes';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', async (_req, res) => {
  try {
    const { db } = await import('../server/db');
    const { sql } = await import('drizzle-orm');
    await db.execute(sql`SELECT 1`);
    res.json({ status: 'ok', db: 'connected', env: process.env.NODE_ENV });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join('/tmp', 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

registerRoutes(app);

export default app;
