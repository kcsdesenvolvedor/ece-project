// app/(app)/configuracoes/actions.ts (Versão Final e Corrigida)
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache';

// 1. Definir um tipo explícito para o estado do formulário
interface FormState {
  message: string;
}

// 2. Usar o tipo 'FormState' para o 'prevState'
export async function updatePlanPrices(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const updates = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('plan-')) {
      const id = parseInt(key.split('-')[1]);
      const price = parseFloat(value as string);

      if (!isNaN(id) && !isNaN(price)) {
        updates.push(
          supabase.from('plans').update({ price: price }).eq('id', id)
        );
      }
    }
  }

  if (updates.length > 0) {
    const results = await Promise.all(updates);
    const hasError = results.some(result => result.error);
    
    if (hasError) {
      console.error('Um ou mais planos falharam ao atualizar.');
      return { message: 'Erro: Não foi possível salvar todos os planos.' };
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/configuracoes');

  // 3. Garantir que o retorno corresponda ao tipo Promise<FormState>
  return { message: 'Valores dos planos atualizados com sucesso!' };
}