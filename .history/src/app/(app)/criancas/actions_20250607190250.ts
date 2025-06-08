// app/(app)/criancas/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// 1. Definir o schema de validação com Zod
const FormSchema = z.object({
  childName: z.string().min(3, { message: "Nome da criança deve ter no mínimo 3 caracteres." }),
  birthDate: z.string().refine((date) => new Date(date) < new Date(), { message: "Data de nascimento inválida." }),
  allergies: z.string().optional(),
  medicalNotes: z.string().optional(),
  imageAuth: z.boolean().default(false),
  guardianName: z.string().min(3, { message: "Nome do responsável deve ter no mínimo 3 caracteres." }),
  guardianCpf: z.string().length(14, { message: "CPF inválido." }), // Ex: 123.456.789-10
  guardianPhone: z.string().min(14, { message: "Telefone inválido." }), // Ex: (11) 99999-9999
  guardianEmail: z.string().email({ message: "Email inválido." }),
  planId: z.coerce.number().min(1, { message: "Selecione um plano." }),
  startDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), { message: "Data de início inválida." }),
})

// 2. Definir o estado do formulário
export type FormState = {
  message: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

// 3. Criar a Server Action
export async function registerChild(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()

  const rawFormData = {
    childName: formData.get('childName'),
    birthDate: formData.get('birthDate'),
    allergies: formData.get('allergies'),
    medicalNotes: formData.get('medicalNotes'),
    imageAuth: formData.get('imageAuth') === 'on',
    guardianName: formData.get('guardianName'),
    guardianCpf: formData.get('guardianCpf'),
    guardianPhone: formData.get('guardianPhone'),
    guardianEmail: formData.get('guardianEmail'),
    planId: formData.get('planId'),
    startDate: formData.get('startDate'),
  }

  // Validar os dados com Zod
  const validatedFields = FormSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return {
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  
  const { data } = validatedFields;

  // Chamar a função PostgreSQL que criamos
  const { error } = await supabase.rpc('create_full_child_enrollment', {
    child_name: data.childName,
    child_birth_date: data.birthDate,
    child_allergies: data.allergies,
    child_medical_notes: data.medicalNotes,
    child_image_auth: data.imageAuth,
    guardian_name: data.guardianName,
    guardian_cpf: data.guardianCpf,
    guardian_phone: data.guardianPhone,
    guardian_email: data.guardianEmail,
    plan_id_to_enroll: data.planId,
    enrollment_start_date: data.startDate,
  })


  if (error) {
    console.error('Erro ao cadastrar criança:', error)
    return { message: 'Erro do banco de dados: Não foi possível realizar o cadastro.' }
  }

  revalidatePath('/dashboard') // Atualiza o cache do dashboard
  revalidatePath('/criancas')  // Atualiza o cache da lista de crianças
  redirect('/dashboard') // Redireciona para o dashboard com mensagem de sucesso (a ser implementada)
}

export async function deleteChild(formData: FormData) {
    const childId = formData.get('childId') as string;
  
    if (!childId) {
      throw new Error('ID da criança é obrigatório.');
    }
  
    const supabase = createClient();
    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', childId);
  
    if (error) {
      console.error('Erro ao excluir criança:', error);
      throw new Error('Erro no banco de dados: Não foi possível excluir a criança.');
    }
  
    // IMPORTANTE: Limpa o cache para que as páginas sejam recarregadas com os dados atualizados.
    revalidatePath('/criancas');
    revalidatePath('/dashboard');
  }

  export async function getChildAttendanceForMonth(childId: string, month: Date) {
    'use server'; // Marcar como uma Server Action
  
    const supabase = createClient();
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1).toISOString();
  
    const { data, error } = await supabase.rpc('get_child_attendance_by_month', {
        p_child_id: childId,
        p_month_start: monthStart,
    });
  
    if (error) {
        console.error("Erro na Server Action ao buscar presença:", error);
        return []; // Retorna um array vazio em caso de erro
    }
  
    return data;
  }