// app/(app)/chamada/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const AttendanceSchema = z.object({
  childId: z.string().uuid(),
  status: z.enum(['present', 'absent']),
  date: z.string().refine((date) => !isNaN(new Date(date).getTime())),
})

export async function markAttendance(formData: FormData) {
  const supabase = await createClient()

  const validatedFields = AttendanceSchema.safeParse({
    childId: formData.get('childId'),
    status: formData.get('status'),
    date: formData.get('date'),
  })

  if (!validatedFields.success) {
    console.error(validatedFields.error)
    return { error: 'Dados inválidos.' }
  }

  const { childId, status, date } = validatedFields.data

  const { error } = await supabase.from('attendance').upsert(
    {
      child_id: childId,
      date: date,
      status: status,
    },
    { onConflict: 'child_id, date' } // Se já existir um registro para esta criança nesta data, atualize-o
  )

  if (error) {
    console.error('Erro ao marcar presença:', error)
    return { error: 'Erro no banco de dados.' }
  }

  // Revalida o cache da página de chamada para que ela mostre os dados atualizados
  // em um futuro refresh, e também do dashboard.
  revalidatePath('/chamada')
  revalidatePath('/dashboard')
}