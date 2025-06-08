// app/(app)/criancas/page.tsx (Versão com Cards)

import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // Garantir que os componentes do Card estejam importados
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

// O tipo de dado não muda
type ChildListItem = {
  id: string;
  name: string;
  plan_name: string;
  start_date: string;
};

export default async function ChildrenListPage() {
  const supabase = createClient();
  const { data: children, error } = await supabase.rpc('get_children_list');

  if (error) {
    console.error('Erro ao buscar a lista de crianças:', error);
    return <p className="text-destructive">Não foi possível carregar a lista de crianças.</p>;
  }

  return (
    <div className="space-y-4">
      {/* O cabeçalho responsivo que já corrigimos */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Crianças Matriculadas</h1>
        <Button asChild className="w-full md:w-auto">
          <Link href="/criancas/cadastrar">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Nova Criança
          </Link>
        </Button>
      </div>

      {/* A nova lógica de renderização com Cards */}
      {children && children.length > 0 ? (
        // Grid Responsivo: 1 coluna no mobile, 2 em tablets, 3 em desktops
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(children as ChildListItem[]).map((child) => (
            // Card Individual
            <Card key={child.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{child.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p>
                  <span className="font-semibold">Plano:</span> {child.plan_name}
                </p>
                <p>
                  <span className="font-semibold">Data de Início:</span>{' '}
                  {new Date(child.start_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // Mensagem para quando não houver crianças
        <Card className="mt-6">
            <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                    <p>Nenhuma criança cadastrada ainda.</p>
                    <p className="text-sm">Clique em "Cadastrar Nova Criança" para começar.</p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}