// app/(auth)/login/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email e senha são obrigatórios.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Erro de login:', error)
    // Não retorne o erro detalhado para o usuário por segurança
    return redirect('/login?message=Credenciais inválidas.')
  }
  
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}