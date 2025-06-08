// app/(app)/configuracoes/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache';

export async function updatePlanPrices(prevState: { message: string }, formData: FormData) {
  const supabase = await createClient();
  const updates = [];

  // Itera sobre os dados do formulário para preparar as atualizações
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
    // Executa todas as atualizações em paralelo
    const results = await Promise.all(updates);
    
    const hasError = results.some((result: any) => result.error);
    
    if (hasError) {
      console.error('Um ou mais planos falharam ao atualizar.');
      return { message: 'Erro: Não foi possível salvar todos os planos.' };
    }
  }

  // Revalida o cache do dashboard, pois a receita mensal mudou
  revalidatePath('/dashboard');
  revalidatePath('/configuracoes'); // Revalida a própria página

  return { message: 'Valores dos planos atualizados com sucesso!' };
}