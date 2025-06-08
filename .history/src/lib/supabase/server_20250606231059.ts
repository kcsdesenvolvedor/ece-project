// lib/supabase/server.ts (Versão Definitiva e Corrigida)

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        // A função `get` lê um cookie específico.
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // A função `set` define um cookie.
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Ignora o erro quando chamado em um ambiente somente leitura.
          }
        },
        // A função `remove` remove um cookie.
        remove(name: string) {
          try {
            cookieStore.delete(name)
          } catch (error) {
            // Ignora o erro quando chamado em um ambiente somente leitura.
          }
        },
      },
    }
  )
}