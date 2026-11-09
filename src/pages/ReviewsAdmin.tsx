import { useState, type FormEvent } from 'react';
import { readReviewsResponse } from '../components/reviews-api';

type PendingReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
};

type AdminResponse = { reviews?: PendingReview[]; error?: string; message?: string };

export function ReviewsAdmin() {
  const [password, setPassword] = useState('');
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function requestReviews(secret: string) {
    const response = await fetch('/api/admin/reviews', {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const result = await readReviewsResponse<AdminResponse>(response);
    setReviews(result.reviews || []);
    setAuthenticated(true);
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await requestReviews(password);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to open the review inbox.');
    } finally {
      setBusy(false);
    }
  }

  async function moderate(id: string, action: 'approve' | 'reject') {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, action }),
      });
      const result = await readReviewsResponse<AdminResponse>(response);
      setReviews((current) => current.filter((review) => review.id !== id));
      setNotice(result.message || 'Review updated.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The review could not be updated.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="reviews-admin">
      <div className="reviews-admin__top">
        <a href="/" className="reviews-admin__back">
          ← Back to the website
        </a>
        <span>Dr. Prashanth · Review inbox</span>
      </div>
      <section className="reviews-admin__panel" aria-labelledby="admin-title">
        <p className="hero__kicker">Private therapist dashboard</p>
        <h1 id="admin-title">Review inbox</h1>
        <p className="reviews-admin__lede">
          Submitted reviews stay private until you approve them. Approved reviews appear on the website.
        </p>

        {!authenticated ? (
          <form className="reviews-admin__login" onSubmit={signIn}>
            <label className="review-form__field">
              <span>Admin password</span>
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            {error && <p className="review-form__message is-error" role="alert">{error}</p>}
            <button className="btn btn--primary" disabled={busy} type="submit">
              {busy ? 'Checking…' : 'Open review inbox'}
            </button>
          </form>
        ) : (
          <div className="reviews-admin__queue" aria-live="polite">
            {error && <p className="review-form__message is-error" role="alert">{error}</p>}
            {notice && <p className="review-form__message" role="status">{notice}</p>}
            {reviews.length === 0 ? (
              <p className="reviews-admin__empty">You’re all caught up. There are no reviews awaiting approval.</p>
            ) : (
              reviews.map((review) => (
                <article className="reviews-admin__review" key={review.id}>
                  <div className="reviews-admin__review-head">
                    <div>
                      <h2>{review.name}</h2>
                      <p>{review.rating} / 5 stars · {new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span aria-label={`${review.rating} out of 5 stars`} className="review-stars">
                      {'★'.repeat(review.rating)}
                    </span>
                  </div>
                  <p className="reviews-admin__review-text">{review.text}</p>
                  <div className="reviews-admin__actions">
                    <button
                      className="btn btn--primary"
                      disabled={busy}
                      onClick={() => moderate(review.id, 'approve')}
                      type="button"
                    >
                      Approve and publish
                    </button>
                    <button
                      className="btn btn--ghost"
                      disabled={busy}
                      onClick={() => moderate(review.id, 'reject')}
                      type="button"
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}
