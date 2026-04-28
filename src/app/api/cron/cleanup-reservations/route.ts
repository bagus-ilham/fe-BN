import { getSupabaseAdmin } from '@/utils/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { API_ERROR_MESSAGES, cleanupReservationsSuccessMessage } from '@/constants/api-messages';

/**
 * API Route untuk membersihkan reservasi inventaris yang kedaluwarsa secara otomatis.
 * Dipanggil oleh CRON job (Vercel Cron atau serupa).
 * Rekomendasi jadwal: setiap 15 menit.
 *
 * vercel.json: { "crons": [{ "path": "/api/cron/cleanup-reservations", "schedule": "0,15,30,45 * * * *" }] }
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: API_ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('cleanup_expired_reservations');

    if (error) {
      console.error('Error cleaning up expired reservations:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      cleaned: data || 0,
      message: cleanupReservationsSuccessMessage(data || 0),
    });
  } catch (err: unknown) {
    console.error('Error in cleanup-reservations cron:', err);
    return NextResponse.json({ error: API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}

