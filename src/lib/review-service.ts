/**
 * Review Service
 */

interface SubmitReviewParams {
  product_id: string;
  rating: number;
  text: string;
  author_name: string;
  author_email: string;
  image_url?: string | null;
}

export async function submitReview(params: SubmitReviewParams): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Falha ao enviar avaliação' };
    }

    return { success: true, message: data.message || 'Avaliação enviada com sucesso!' };
  } catch (err) {
    console.error('[REVIEW SERVICE] Error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Erro interno' };
  }
}
