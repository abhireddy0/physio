import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import reviewsHandler from './api/reviews';
import adminReviewsHandler from './api/admin/reviews';

const app = express();
const root = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(root, '../dist');

app.disable('x-powered-by');
app.use(express.json({ limit: '8kb' }));

app.get('/healthz', (_req, res) => {
  res.status(200).type('text/plain').send('ok');
});

app.all('/api/reviews', (req, res) => {
  void reviewsHandler(req, res);
});

app.all('/api/admin/reviews', (req, res) => {
  void adminReviewsHandler(req, res);
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

app.use(express.static(publicDirectory, { index: false }));

app.get('/reviews-admin', (_req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

app.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  if (req.path.startsWith('/api/')) {
    const status = typeof error === 'object' && error !== null && 'status' in error
      ? Number(error.status)
      : 400;
    res.status(status === 413 ? 413 : 400).json({ error: 'The request body must be valid JSON under 8 KB.' });
    return;
  }
  next(error);
});

const port = Number(process.env.PORT) || 10000;
createServer(app).listen(port, '0.0.0.0', () => {
  console.log(`Physio website and reviews API listening on port ${port}.`);
});
