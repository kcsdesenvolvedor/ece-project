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

// O tipo é o mesmo de antes
type ChildListItem = {
  id: string;
  name: string;
  plan_name: string;
  start_date: string;
};

export function ChildrenCardList({ children }: { children: ChildListItem[] }) {
  return (
    <>
      {children && children.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
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
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      {/* Formulário que chama a Server Action de exclusão */}
                      <form action={deleteChild}>
                          <input type="hidden" name="childId" value={child.id} />
                          <AlertDialogAction type="submit">
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