// app/(app)/criancas/[id]/edit/page.tsx (Versão Corrigida e Tipada)

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
// 1. Importar o tipo ChildEditData junto com o componente
import { ChildForm, type ChildEditData } from '../../child-form';
import { updateChild } from '../../actions';

interface EditChildPageProps {
  params: {
    id: string;
  };
}

export default async function EditChildPage({ params }: EditChildPageProps) {
  const supabase = createClient();

  // 2. Aplicar o tipo <ChildEditData> à chamada do Supabase
  const { data: childData, error } = await supabase
    .rpc('get_child_for_editing', { p_child_id: params.id })
    .single<ChildEditData>(); // <- AQUI ESTÁ A CORREÇÃO

  if (error || !childData) {
    notFound();
  }

  // 3. Agora o TypeScript sabe que childData tem as propriedades corretas
  return (
    <ChildForm
      action={updateChild}
      initialData={childData}
      buttonText="Salvar Alterações"
      childId={params.id}
      guardianId={childData.guardian_id!} // Adicionamos '!' para afirmar que não será nulo
      enrollmentId={childData.enrollment_id!} // Adicionamos '!' para afirmar que não será nulo
    />
  );
}