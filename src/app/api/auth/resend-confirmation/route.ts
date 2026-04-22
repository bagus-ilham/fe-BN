import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { API_ERROR_MESSAGES, AUTH_ERROR_MESSAGES, AUTH_MESSAGES } from '@/constants/api-messages';

/**
 * API Route para reenviar email de confirmação
 * POST /api/auth/resend-confirmation
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: AUTH_ERROR_MESSAGES.EMAIL_REQUIRED },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Reenviar email de confirmação
    // Estratégia: Tentar usar resend se disponível, senão usar signUp com senha temporária
    const origin = request.headers.get('origin') || new URL(request.url).origin;
    
    // Tentar método resend primeiro (se disponível na versão do Supabase)
    try {
      // @ts-ignore - resend pode não estar disponível em todas as versões
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (!resendError) {
        return NextResponse.json({
          success: true,
          message: AUTH_MESSAGES.RESEND_CONFIRMATION_RESENT,
        });
      }

      // Se resend não funcionar, continuar com fallback
    } catch {
      // Método resend não disponível, usar fallback
    }

    // Fallback: Usar signUp com senha temporária
    // Isso enviará email de confirmação se o usuário existir e não estiver confirmado
    // Se o usuário já estiver confirmado, retornará erro mas não criará conta duplicada
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Senha temporária única
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          resend_confirmation: true,
        },
      },
    });

    if (error) {
      // Tratamento específico para rate limit
      const isRateLimit = 
        error.message?.toLowerCase().includes('rate limit') ||
        error.message?.toLowerCase().includes('rate_limit') ||
        error.message?.toLowerCase().includes('too many requests') ||
        error.message?.toLowerCase().includes('email rate limit exceeded') ||
        error.code === 'rate_limit_exceeded' ||
        error.status === 429;
      
      if (isRateLimit) {
        return NextResponse.json(
          { 
            error: AUTH_ERROR_MESSAGES.RESEND_RATE_LIMITED,
            rateLimit: true,
          },
          { status: 429 }
        );
      }
      
      // Se o erro for que o usuário já está confirmado ou registrado
      if (
        error.message?.includes('already confirmed') ||
        error.message?.includes('already registered') ||
        error.message?.includes('User already registered') ||
        error.message?.includes('already exists')
      ) {
        // Retornar sucesso genérico para segurança (não expor se email está confirmado)
        return NextResponse.json({
          success: true,
          message: AUTH_MESSAGES.RESEND_CONFIRMATION_GENERIC,
        });
      }

      // Outros erros
      return NextResponse.json(
        { error: error.message || AUTH_ERROR_MESSAGES.RESEND_FAILED },
        { status: 400 }
      );
    }

    // Sucesso - email enviado
    return NextResponse.json({
      success: true,
      message: AUTH_MESSAGES.RESEND_CONFIRMATION_SENT,
    });
  } catch (err: unknown) {
    console.error('Erro ao reenviar confirmação:', err);
    return NextResponse.json(
      { error: API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
