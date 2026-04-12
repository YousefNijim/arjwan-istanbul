import type { IncomingMessage, ServerResponse } from 'http';

let cachedApp: any = null;
let initError: string | null = null;

async function getApp() {
  if (cachedApp) return cachedApp;
  if (initError) throw new Error(initError);

  try {
    const { default: express } = await import('express');
    const { default: cors } = await import('cors');
    const path = await import('path');
    const fs = await import('fs');

    const app = express();
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    app.get('/api/health', async (_req: any, res: any) => {
      try {
        const { db } = await import('../server/db');
        const { sql } = await import('drizzle-orm');
        await db.execute(sql`SELECT 1`);
        res.json({ status: 'ok', db: 'connected', dbUrl: process.env.DATABASE_URL?.slice(0, 30) + '...' });
      } catch (err: any) {
        res.status(500).json({ status: 'db_error', message: err.message });
      }
    });

    app.get('/uploads/:filename', (req: any, res: any) => {
      const filePath = path.join('/tmp', 'uploads', req.params.filename);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).json({ error: 'Image not found' });
      }
    });

    const { registerRoutes } = await import('../server/routes');
    registerRoutes(app);

    cachedApp = app;
    return app;
  } catch (err: any) {
    initError = err.message;
    throw err;
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const app = await getApp();
    app(req, res);
  } catch (err: any) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Function init failed', message: err.message }));
  }
}
