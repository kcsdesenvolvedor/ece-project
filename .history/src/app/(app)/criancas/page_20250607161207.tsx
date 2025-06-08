// app/(app)/criancas/page.tsx

import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

// Definimos o tipo de dado que nossa função RPC retorna
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <h1 className="text-2xl font-bold">Crianças Matriculadas</h1>
  <Button asChild className="w-full md:w-auto">
    <Link href="/criancas/cadastrar">
      <PlusCircle className="mr-2 h-4 w-4" />
      Cadastrar Nova Criança
    </Link>
  </Button>
</div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Criança</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Data de Início</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {children && children.length > 0 ? (
              (children as ChildListItem[]).map((child) => (
                <TableRow key={child.id}>
                  <TableCell className="font-medium">{child.name}</TableCell>
                  <TableCell>{child.plan_name}</TableCell>
                  <TableCell>
                    {new Date(child.start_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Espaço para futuros botões como "Editar" ou "Ver Perfil" */}
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhuma criança cadastrada ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}