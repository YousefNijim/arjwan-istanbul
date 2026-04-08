import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { registerRoutes } from './routes';

const app = express();
const PORT = 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

registerRoutes(app);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on http://0.0.0.0:${PORT}`);
});
