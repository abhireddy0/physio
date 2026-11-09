import type { IncomingMessage, ServerResponse } from 'node:http';
import { ObjectId } from 'mongodb';
import {
  handleApiError,
  readJsonBody,
  requireAdmin,
  reviewsCollection,
  sendJson,
  toPublicReview,
} from '../../src/server/reviews';

type AdminReviewRequest = IncomingMessage & { body?: unknown };

export default async function adminReviewsHandler(req: AdminReviewRequest, res: ServerResponse): Promise<void> {
  try {
    requireAdmin(req);

    if (req.method === 'GET') {
      const reviews = await (await reviewsCollection())
        .find({ status: 'pending' }, { projection: { name: 1, rating: 1, text: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();
      sendJson(res, 200, { reviews: reviews.map(toPublicReview) });
      return;
    }

    if (req.method !== 'PATCH') {
      res.setHeader('Allow', 'GET, PATCH');
      sendJson(res, 405, { error: 'Use GET to view pending reviews or PATCH to review one.' });
      return;
    }

    const body = await readJsonBody(req);
    if (typeof body.id !== 'string' || !ObjectId.isValid(body.id)) {
      sendJson(res, 400, { error: 'A valid review ID is required.' });
      return;
    }
    if (body.action !== 'approve' && body.action !== 'reject') {
      sendJson(res, 400, { error: 'Choose whether to approve or reject this review.' });
      return;
    }

    const result = await (await reviewsCollection()).updateOne(
      { _id: new ObjectId(body.id), status: 'pending' },
      {
        $set: {
          status: body.action === 'approve' ? 'approved' : 'rejected',
          reviewedAt: new Date(),
        },
      },
    );
    if (result.matchedCount !== 1) {
      sendJson(res, 404, { error: 'This pending review was not found. Refresh the list and try again.' });
      return;
    }

    sendJson(res, 200, { message: `Review ${body.action === 'approve' ? 'approved' : 'rejected'}.` });
  } catch (error) {
    handleApiError(res, error);
  }
}
