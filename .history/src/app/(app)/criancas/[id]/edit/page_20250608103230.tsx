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

export default async function EditChildPage(props: EditChildPageProps) {
  // 2. Acessar 'params' a partir de 'props'
  const { id } = props.params;
  const supabase = await createClient();

  const { data: childData, error } = await supabase
    .rpc('get_child_for_editing', { p_child_id: id }) // Usar o 'id' desestruturado
    .single<ChildEditData>();

  if (error || !childData) {
    notFound();
  }

  return (
    <ChildForm
      action={updateChild}
      initialData={childData}
      buttonText="Salvar Alterações"
      childId={id} // Passar o 'id' aqui
      guardianId={childData.guardian_id!}
      enrollmentId={childData.enrollment_id!}
    />
  );
}