import { z } from 'zod';

// Portuguese error messages
const messages = {
  required: 'Este campo é obrigatório',
  emailInvalid: 'Por favor, insira um email válido',
  passwordMin: 'Senha deve ter pelo menos 8 caracteres',
  birthDateFuture: 'Data de nascimento não pode ser no futuro',
  diagnosisBeforeBirth: 'Data de diagnóstico deve ser após data de nascimento'
};

export const userRegistrationSchema = z.object({
  nome: z.string()
    .min(1, { message: messages.required })
    .trim(),
  
  email: z.string()
    .min(1, { message: messages.required })
    .email({ message: messages.emailInvalid })
    .toLowerCase(),
  
  password: z.string()
    .min(8, { message: messages.passwordMin }),
  
  data_nascimento: z.date({
    message: messages.required
  })
  .refine((date) => date <= new Date(), {
    message: messages.birthDateFuture
  }),
  
  sexo: z.enum(['Masculino', 'Feminino', 'Outro', 'Prefiro não informar'], {
    message: messages.required
  }),
  
  data_diagnostico: z.date({
    message: messages.required
  }),
  
  medicacoes: z.string()
    .min(1, { message: messages.required })
    .trim()
})
.refine((data) => data.data_diagnostico >= data.data_nascimento, {
  message: messages.diagnosisBeforeBirth,
  path: ['data_diagnostico']
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export { messages };