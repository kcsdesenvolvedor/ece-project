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
  avatarUrl: z.string().url("URL da imagem inválida").optional().nullable(),
  guardianName: z.string().min(3, { message: "Nome do responsável deve ter no mínimo 3 caracteres." }),
  guardianCpf: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional()
  ),
  guardianPhone: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional()
  ),
  guardianEmail: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().email({ message: "Formato de email inválido." }).nullable().optional()
  ),
  
  planId: z.coerce.number().min(1, { message: "Selecione um plano." }),
  discount: z.preprocess(
    (val) => (val === '' ? undefined : val), // Trata string vazia como undefined
    z.coerce.number().min(0, "O desconto não pode ser negativo.").optional()
  ),
  surcharge: z.preprocess(
    (val) => (val === '' || val === null ? 0 : val),
    z.coerce.number().min(0, "O acréscimo não pode ser negativo.").default(0)
  ),
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
    avatarUrl: formData.get('avatarUrl'),
    guardianName: formData.get('guardianName'),
    guardianCpf: formData.get('guardianCpf'),
    guardianPhone: formData.get('guardianPhone'),
    guardianEmail: formData.get('guardianEmail'),
    planId: formData.get('planId'),
    startDate: formData.get('startDate'),
    discount: formData.get('discount'),
    surcharge: formData.get('surcharge'),
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
    p_avatar_url: data.avatarUrl,
    guardian_name: data.guardianName,
    guardian_cpf: data.guardianCpf,
    guardian_phone: data.guardianPhone,
    guardian_email: data.guardianEmail,
    plan_id_to_enroll: data.planId,
    enrollment_start_date: data.startDate,
    p_discount: data.discount ?? 0,
    p_surcharge: data.surcharge ?? 0,
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
  
    const supabase = await createClient();
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
  
    const supabase = await createClient();
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

// Adicione esta nova action
export async function updateChild(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    
    const rawFormData = {
      // ... (copie todos os campos do schema do registerChild)
      childName: formData.get('childName'),
      birthDate: formData.get('birthDate'),
      allergies: formData.get('allergies'),
      medicalNotes: formData.get('medicalNotes'),
      imageAuth: formData.get('imageAuth') === 'on',
      avatarUrl: formData.get('avatarUrl'),
      guardianName: formData.get('guardianName'),
      guardianCpf: formData.get('guardianCpf'),
      guardianPhone: formData.get('guardianPhone'),
      guardianEmail: formData.get('guardianEmail'),
      planId: formData.get('planId'),
      startDate: formData.get('startDate'), // Embora não seja editado, precisa estar no schema
      discount: formData.get('discount'),
      surcharge: formData.get('surcharge'),
    };
  
    // Reutilizamos o mesmo schema de validação
    const validatedFields = FormSchema.safeParse(rawFormData);
  
    if (!validatedFields.success) {
      return {
        message: 'Erro de validação. Por favor, corrija os campos destacados.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const { data } = validatedFields;
    const childId = formData.get('childId') as string;
    const guardianId = formData.get('guardianId') as string;
    const enrollmentId = formData.get('enrollmentId') as string;
  
    const { error } = await supabase.rpc('update_full_child_enrollment', {
      p_child_id: childId,
      p_child_name: data.childName,
      p_birth_date: data.birthDate,
      p_allergies: data.allergies,
      p_medical_notes: data.medicalNotes,
      p_image_auth: data.imageAuth,
      p_avatar_url: data.avatarUrl,
      p_guardian_id: guardianId,
      p_guardian_name: data.guardianName,
      p_guardian_cpf: data.guardianCpf,
      p_guardian_phone: data.guardianPhone,
      p_guardian_email: data.guardianEmail,
      p_enrollment_id: enrollmentId,
      p_plan_id_to_enroll: data.planId,
      p_discount: data.discount ?? 0,
      p_surcharge: data.surcharge ?? 0,
    });
  
    if (error) {
      console.error('Erro ao atualizar criança:', error);
      return { message: 'Erro do banco de dados: Não foi possível salvar as alterações.' };
    }
  
    revalidatePath('/criancas');
    revalidatePath(`/criancas/${childId}`);
    redirect('/criancas');
  }


  export async function callTestFunction() {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('test_function', { p_name: 'World' });
    console.log({ data, error });
}