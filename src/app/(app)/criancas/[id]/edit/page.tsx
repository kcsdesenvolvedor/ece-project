// src/app/(app)/criancas/[id]/edit/page.tsx (Solução Final)

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ChildForm, type ChildEditData } from '../../child-form';
import { updateChild } from '../../actions';

interface PageProps {
  id: string;
}

// Tipar diretamente na assinatura da função
export default async function EditChildPage( {params} : { params: PageProps }) {
  const supabase = await createClient();

  const { data: childData, error } = await supabase
    .rpc('get_child_for_editing', { p_child_id: params.id })
    .single<ChildEditData>();

  if (error || !childData) {
    notFound();
  }

  return (
    <ChildForm
      action={updateChild}
      initialData={childData}
      buttonText="Salvar Alterações"
      childId={params.id}
      guardianId={childData.guardian_id!}
      enrollmentId={childData.enrollment_id!}
    />
  );
}