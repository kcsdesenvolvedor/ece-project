// src/app/(app)/criancas/[id]/edit/page.tsx (Versão Final e Corrigida)

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
// 1. Corrigir o caminho da importação
import { ChildForm, type ChildEditData } from '../../child-form';
import { updateChild } from '../../actions';

// 2. Remover a interface PageProps

// 3. Tipar diretamente na assinatura da função
export default async function EditChildPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const childId = params.id;

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