export async function readReviewsResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(
      'The reviews server is unavailable. Deploy this project to Vercel and configure its MongoDB and admin-password environment variables.',
    );
  }

  let result: T & { error?: string };
  try {
    result = (await response.json()) as T & { error?: string };
  } catch {
    throw new Error('The reviews server returned an invalid response. Please try again later.');
  }
  if (!response.ok) {
    throw new Error(result.error || 'The review request could not be completed. Please try again later.');
  }
  return result;
}
