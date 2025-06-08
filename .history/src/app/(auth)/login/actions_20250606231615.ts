// app/(auth)/login/actions.ts (Corrigido)
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Definindo um tipo para o estado do nosso formulário
export type FormState = {
  message: string;
}

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { message: 'Email e senha são obrigatórios.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Erro de login:', error)
    // Retorna uma mensagem de erro genérica para o estado do formulário
    return { message: 'Credenciais inválidas. Por favor, tente novamente.' }
  }
  
  // Em caso de sucesso, o redirect interrompe a execução.
  // Não precisamos de um return aqui.
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}