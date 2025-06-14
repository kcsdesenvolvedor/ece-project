// app/(app)/criancas/children-card-list.tsx
'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteChild } from './actions';
import { FilePenLine } from 'lucide-react';

// O tipo é o mesmo de antes
type ChildListItem = {
  id: string;
  name: string;
  plan_name: string;
  start_date: string;
};

export function ChildrenCardList({ initialChildren: children }: { initialChildren: ChildListItem[] }) {
  return (
    <>
      {children && children.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <Card key={child.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{child.name}</CardTitle>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/criancas/${child.id}/edit`}>
                        <FilePenLine className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </Button>
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
              <CardFooter className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/criancas/${child.id}`}>Ver Detalhes</Link>
                </Button>

                {/* AlertDialog para a confirmação de exclusão */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso excluirá permanentemente os dados da criança, incluindo matrículas e registros de presença.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    {/* Bloco AlertDialogFooter Corrigido */}
                    {/* Bloco AlertDialogFooter - Solução Final e Correta */}
                    <AlertDialogFooter className="grid grid-cols-2 gap-2">
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <form action={deleteChild}>
                            <input type="hidden" name="childId" value={child.id} />
                            <AlertDialogAction type="submit" className="w-full">
                            Confirmar Exclusão
                            </AlertDialogAction>
                        </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-6">
            <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                    <p>Nenhuma criança cadastrada ainda.</p>
                </div>
            </CardContent>
        </Card>
      )}
    </>
  )
}