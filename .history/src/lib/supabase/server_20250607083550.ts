// lib/supabase/server.ts (Versão Realmente Definitiva e Corrigida)

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 1. A função createClient NÃO precisa ser async, pois createServerClient não é async.
// O erro estava em como `cookies()` é chamado dentro das funções do objeto.
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        // 2. Não precisamos de async/await aqui, pois cookieStore já é o objeto.
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // A função `set` do cookieStore é síncrona.
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignorar erros em ambientes somente leitura como Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // A função `remove` (ou set com valor vazio) também é síncrona.
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignorar erros em ambientes somente leitura
          }
        },
      },
    }
  )
}