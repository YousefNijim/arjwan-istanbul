import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../server/routes';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

registerRoutes(app);

export default app;