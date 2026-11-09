import { createHash, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { MongoClient, ObjectId, type Collection } from 'mongodb';

export type ReviewRecord = {
  name: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
};

type JsonRecord = Record<string, unknown>;
type ApiRequest = IncomingMessage & { body?: unknown };

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const globalMongo = globalThis as typeof globalThis & {
  reviewsMongoClient?: Promise<MongoClient>;
};

export async function reviewsCollection(): Promise<Collection<ReviewRecord>> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new HttpError(503, 'The review service is not configured yet.');

  if (!globalMongo.reviewsMongoClient) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    const connection = client.connect();
    globalMongo.reviewsMongoClient = connection;
    connection.catch(() => {
      if (globalMongo.reviewsMongoClient === connection) delete globalMongo.reviewsMongoClient;
    });
  }

  const client = await globalMongo.reviewsMongoClient;
  const database = process.env.MONGODB_DB?.trim() || 'physio';
  return client.db(database).collection<ReviewRecord>('reviews');
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function readJsonBody(req: ApiRequest): Promise<JsonRecord> {
  const body = req.body;
  if (isJsonRecord(body)) return body;

  let raw = typeof body === 'string' ? body : '';
  if (body === undefined) {
    for await (const chunk of req) {
      raw += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
      if (Buffer.byteLength(raw) > 8192) throw new HttpError(413, 'The submitted form is too large.');
    }
  }
  if (!raw.trim()) throw new HttpError(400, 'A JSON request body is required.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new HttpError(400, 'The request body must be valid JSON.');
  }
  if (!isJsonRecord(parsed)) throw new HttpError(400, 'The request body must be a JSON object.');
  return parsed;
}

export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

export function handleApiError(res: ServerResponse, error: unknown): void {
  if (error instanceof HttpError) {
    sendJson(res, error.status, { error: error.message });
    return;
  }

  console.error('Reviews API error:', error);
  sendJson(res, 500, { error: 'The request could not be completed. Please try again later.' });
}

export function requireAdmin(req: IncomingMessage): void {
  const expected = process.env.REVIEWS_ADMIN_PASSWORD;
  if (!expected) throw new HttpError(503, 'Therapist review access is not configured yet.');

  const header = req.headers.authorization;
  const provided = typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : '';
  const expectedHash = createHash('sha256').update(expected).digest();
  const providedHash = createHash('sha256').update(provided).digest();
  if (!provided || provided.length > 256 || !timingSafeEqual(expectedHash, providedHash)) {
    throw new HttpError(401, 'The password is incorrect.');
  }
}

export function toPublicReview(review: ReviewRecord & { _id: ObjectId }) {
  return {
    id: review._id.toString(),
    name: review.name,
    rating: review.rating,
    text: review.text,
    createdAt: review.createdAt.toISOString(),
  };
}
