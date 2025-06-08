// app/(app)/criancas/page.tsx (Versão refatorada)

import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { ChildrenCardList } from './children-card-list'; // Importa nosso novo componente de cliente

// O tipo pode ser exportado para ser usado pelo componente de cliente
export type ChildListItem = {
  id: string;
  name: string;
  plan_name: string;
  start_date: string;
};

// Este é agora um Server Component puro
export default async function ChildrenListPage() {
  const supabase = createClient();
  const { data: children, error } = await supabase.rpc('get_children_list');

  if (error) {
    console.error('Erro ao buscar a lista de crianças:', error);
    return <p className="text-destructive">Não foi possível carregar a lista de crianças.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Crianças Matriculadas</h1>
        <Button asChild className="w-full md:w-auto">
          <Link href="/criancas/cadastrar">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Nova Criança
          </Link>
        </Button>
      </div>

      {/* Renderiza o componente de cliente, passando os dados do servidor */}
      <ChildrenCardList children={children as ChildListItem[]} />
    </div>
  );
}