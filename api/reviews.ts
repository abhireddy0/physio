import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleApiError, readJsonBody, reviewsCollection, sendJson, toPublicReview } from '../src/server/reviews';

type ReviewRequest = IncomingMessage & { body?: unknown };

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export default async function reviewsHandler(req: ReviewRequest, res: ServerResponse): Promise<void> {
  try {
    if (req.method === 'GET') {
      const reviews = await (await reviewsCollection())
        .find({ status: 'approved' }, { projection: { name: 1, rating: 1, text: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
      sendJson(res, 200, { reviews: reviews.map(toPublicReview) });
      return;
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      sendJson(res, 405, { error: 'Use GET to read reviews or POST to submit one.' });
      return;
    }

    const body = await readJsonBody(req);
    if (typeof body.website === 'string' && body.website.trim()) {
      sendJson(res, 400, { error: 'The review could not be submitted.' });
      return;
    }

    const name = cleanText(body.name, 60);
    const text = cleanText(body.text, 500);
    const rating = Number(body.rating);
    if (name.length < 2 || !Number.isInteger(rating) || rating < 1 || rating > 5 || text.length < 10 || body.consent !== true) {
      sendJson(res, 400, { error: 'Please provide a name, a 1–5 star rating, a review of at least 10 characters, and consent.' });
      return;
    }

    const reviews = await reviewsCollection();
    await reviews.insertOne({
      name,
      rating,
      text,
      status: 'pending',
      createdAt: new Date(),
    });
    sendJson(res, 201, { message: 'Thank you. Your review has been sent to Dr. Prashanth for approval.' });
  } catch (error) {
    handleApiError(res, error);
  }
}
