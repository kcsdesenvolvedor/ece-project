// src/app/(app)/criancas/[id]/edit/page.tsx (Código Final Alinhado com a Documentação)

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ChildForm, type ChildEditData } from '../../child-form';
import { updateChild } from '../../actions';

// Esta é a assinatura exata que a documentação recomenda para uma página async com params.
export default async function EditChildPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  // 1. Resolver a promessa dos parâmetros PRIMEIRO e obter o ID.
  const resolvedParams = await params;
  const childId = resolvedParams.id;

  const { data: childData, error } = await supabase
    .rpc('get_child_for_editing', { p_child_id: childId })
    .single<ChildEditData>();

  if (error || !childData) {
    notFound();
  }

  return (
    <ChildForm
      action={updateChild}
      initialData={childData}
      buttonText="Salvar Alterações"
      childId={childId}
      guardianId={childData.guardian_id!}
      enrollmentId={childData.enrollment_id!}
    />
  );
}