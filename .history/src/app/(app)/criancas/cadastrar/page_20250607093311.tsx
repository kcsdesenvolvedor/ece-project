// app/(app)/criancas/cadastrar/page.tsx (CORRIGIDO)
'use client'

import { useActionState } from 'react' // 1. ALTERADO: Importado de 'react'
import { useFormStatus } from 'react-dom' // useFormStatus continua em 'react-dom'
import { registerChild, type FormState } from '../actions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full md:w-auto" aria-disabled={pending}>
      {pending ? 'Salvando...' : 'Salvar Cadastro'}
    </Button>
  )
}

export default function RegisterChildPage() {
  const initialState: FormState = { message: '', errors: {} };
  // 2. ALTERADO: useFormState -> useActionState
  const [state, dispatch] = useActionState(registerChild, initialState);

  const plans = [
      {id: 1, name: "Integral"},
      {id: 2, name: "Meio Período"},
      {id: 3, name: "Diária"},
  ];

  return (
    <form action={dispatch} className="space-y-8">
      {/* ... O restante do JSX do formulário permanece o mesmo ... */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastrar Nova Criança</h1>
        <SubmitButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Criança</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="childName">Nome Completo</Label>
            <Input id="childName" name="childName" />
            {state.errors?.childName && <p className="text-sm font-medium text-destructive">{state.errors.childName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <DatePicker name="birthDate" />
            {state.errors?.birthDate && <p className="text-sm font-medium text-destructive">{state.errors.birthDate}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="allergies">Alergias</Label>
            <Textarea id="allergies" name="allergies" placeholder="Ex: Amendoim, glúten, lactose..."/>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="medicalNotes">Observações Médicas</Label>
            <Textarea id="medicalNotes" name="medicalNotes" placeholder="Ex: Usa medicamento contínuo, tem alguma condição específica..."/>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="imageAuth" name="imageAuth" />
            <Label htmlFor="imageAuth">Autoriza o uso de imagem?</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Responsável</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
           <div className="space-y-2">
            <Label htmlFor="guardianName">Nome Completo</Label>
            <Input id="guardianName" name="guardianName" />
             {state.errors?.guardianName && <p className="text-sm font-medium text-destructive">{state.errors.guardianName}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="guardianCpf">CPF</Label>
            <Input id="guardianCpf" name="guardianCpf" placeholder="000.000.000-00"/>
             {state.errors?.guardianCpf && <p className="text-sm font-medium text-destructive">{state.errors.guardianCpf}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="guardianPhone">Telefone/WhatsApp</Label>
            <Input id="guardianPhone" name="guardianPhone" placeholder="(00) 00000-0000" />
             {state.errors?.guardianPhone && <p className="text-sm font-medium text-destructive">{state.errors.guardianPhone}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="guardianEmail">Email</Label>
            <Input id="guardianEmail" name="guardianEmail" type="email" placeholder="responsavel@email.com"/>
             {state.errors?.guardianEmail && <p className="text-sm font-medium text-destructive">{state.errors.guardianEmail}</p>}
          </div>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>Plano e Matrícula</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                  <Label htmlFor="planId">Plano Contratado</Label>
                   <Select name="planId">
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent>
                            {plans.map((plan) => (
                                <SelectItem key={plan.id} value={String(plan.id)}>
                                    {plan.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  {state.errors?.planId && <p className="text-sm font-medium text-destructive">{state.errors.planId}</p>}
              </div>
              <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <DatePicker name="startDate" />
                  {state.errors?.startDate && <p className="text-sm font-medium text-destructive">{state.errors.startDate}</p>}
              </div>
          </CardContent>
      </Card>

      {state.message && !state.errors && (
        <p className="text-sm font-medium text-destructive">{state.message}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}