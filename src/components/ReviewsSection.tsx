import { useEffect, useState, type FormEvent } from 'react';

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
};

type ReviewsResponse = { reviews: Review[]; error?: string; message?: string };

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="review-stars" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true" className={index < rating ? 'is-filled' : ''}>
          ★
        </span>
      ))}
    </span>
  );
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/reviews')
      .then(async (response) => {
        const result = (await response.json()) as ReviewsResponse;
        if (!response.ok) throw new Error(result.error || 'Reviews could not be loaded.');
        return result;
      })
      .then((result) => {
        if (active) setReviews(result.reviews);
      })
      .catch((error: unknown) => {
        if (active) setReviewsError(error instanceof Error ? error.message : 'Reviews could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormMessage('');
    setFormError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, text, consent, website }),
      });
      const result = (await response.json()) as ReviewsResponse;
      if (!response.ok) throw new Error(result.error || 'Your review could not be submitted.');
      setName('');
      setText('');
      setRating(0);
      setConsent(false);
      setWebsite('');
      setFormMessage(result.message || 'Thank you. Your review was sent for approval.');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Your review could not be submitted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div className="reviews__intro">
          <div className="reviews__heading">
            <p className="hero__kicker">Patient stories</p>
            <h2 id="reviews-title">Care that moves people forward.</h2>
            <p className="reviews__lede">
              A few words from people who have shared their experience with Dr. Prashanth.
            </p>
          </div>
          <a className="btn btn--secondary" href="#share-review">
            Share your experience
          </a>
        </div>

        <div className="reviews__list" aria-live="polite">
          {loading && <p className="reviews__status">Loading patient reviews…</p>}
          {!loading && reviewsError && <p className="reviews__status">{reviewsError}</p>}
          {!loading && !reviewsError && reviews.length === 0 && (
            <p className="reviews__status">Be the first to share your experience.</p>
          )}
          {!loading &&
            !reviewsError &&
            reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <Stars rating={review.rating} label={`${review.rating} out of 5 stars`} />
                <blockquote>{review.text}</blockquote>
                <div className="review-card__byline">
                  <span className="review-card__initial" aria-hidden="true">
                    {review.name.charAt(0).toLocaleUpperCase()}
                  </span>
                  <div>
                    <p className="review-card__name">{review.name}</p>
                    <time dateTime={review.createdAt}>
                      {new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(
                        new Date(review.createdAt),
                      )}
                    </time>
                  </div>
                </div>
              </article>
            ))}
        </div>

        <div className="review-form-card" id="share-review">
          <div className="review-form-card__intro">
            <span className="review-form-card__eyebrow">Your voice matters</span>
            <h3>Share your experience</h3>
            <p>
              Your review is sent privately to Dr. Prashanth first. It will only appear on this page if approved.
            </p>
          </div>
          <form className="review-form" onSubmit={submitReview}>
            <label className="review-form__field">
              <span>Name or nickname</span>
              <input
                autoComplete="name"
                maxLength={60}
                minLength={2}
                name="name"
                onChange={(event) => setName(event.target.value)}
                placeholder="How you would like to be credited"
                required
                value={name}
              />
            </label>

            <fieldset className="review-form__rating">
              <legend>Your rating</legend>
              <div className="review-form__stars">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  return (
                    <button
                      aria-label={`${value} star${value === 1 ? '' : 's'}`}
                      aria-pressed={rating === value}
                      className={value <= rating ? 'is-filled' : ''}
                      key={value}
                      onClick={() => setRating(value)}
                      type="button"
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="review-form__field">
              <span>Your review</span>
              <textarea
                maxLength={500}
                minLength={10}
                name="review"
                onChange={(event) => setText(event.target.value)}
                placeholder="Tell us about your experience (please don't include private medical details)."
                required
                rows={4}
                value={text}
              />
            </label>

            <div className="review-form__honeypot" aria-hidden="true">
              <label>
                Leave this field empty
                <input
                  autoComplete="off"
                  name="website"
                  onChange={(event) => setWebsite(event.target.value)}
                  tabIndex={-1}
                  value={website}
                />
              </label>
            </div>

            <label className="review-form__consent">
              <input checked={consent} onChange={(event) => setConsent(event.target.checked)} required type="checkbox" />
              <span>
                I agree that Dr. Prashanth may review this submission and, if approved, display my name and review on
                this website.
              </span>
            </label>

            {formError && (
              <p className="review-form__message is-error" role="alert">
                {formError}
              </p>
            )}
            {formMessage && (
              <p className="review-form__message" role="status">
                {formMessage}
              </p>
            )}

            <button className="btn btn--primary review-form__submit" disabled={submitting || !rating} type="submit">
              {submitting ? 'Sending…' : 'Send review for approval'}
            </button>
            <p className="review-form__privacy">
              Please keep your review about your experience and avoid sharing personal health information.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
