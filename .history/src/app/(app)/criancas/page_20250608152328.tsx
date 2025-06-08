// app/(app)/criancas/page.tsx (Versão Final com Filtros)

import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { ChildrenCardList } from './children-card-list';
import { ChildrenFilters } from './children-filters'; // 1. Importar o componente de filtros

// O tipo de dado não muda
export type ChildListItem = {
  id: string;
  name: string;
  plan_name: string;
  start_date: string;
};


export default async function ChildrenListPage({ searchParams }: {
  searchParams?: {
    plan?: string;
    search?: string;
  };
}) {
  const supabase = await createClient();

  // 3. Extrair os valores dos filtros da URL, com fallbacks
  const planName = searchParams?.plan || null;
  const searchTerm = searchParams?.search || null;

  // 4. Chamar a RPC com os parâmetros de filtro
  const { data: children, error } = await supabase.rpc('get_children_list', {
    p_plan_name: planName,
    p_search_term: searchTerm,
  });

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

      {/* 5. Renderizar o componente de filtros */}
      <ChildrenFilters />

      {/* 6. Renderizar a lista de cards, que agora recebe a lista já filtrada */}
      <ChildrenCardList initialChildren={children as ChildListItem[]} />
    </div>
  );
}