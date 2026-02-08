import { z } from "zod";

// Email validation schema matching FastAPI EmailStr
export const emailSchema = z
  .string()
  .min(1, "Email é obrigatório")
  .email("Email deve ter um formato válido")
  .max(254, "Email é muito longo"); // RFC 5321 limit

// Password validation schema matching PacienteSchema requirements
// VERSÃO TEMPORÁRIA PARA DEBUG - Removendo validações rigorosas
export const passwordSchema = z
  .string()
  .min(6, "A senha deve ter pelo menos 6 caracteres");

// VERSÃO ORIGINAL COMENTADA - Descomentar após resolver o problema
// export const passwordSchema = z
//   .string()
//   .min(8, 'A senha deve ter pelo menos 8 caracteres')
//   .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
//   .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
//   .regex(/\d/, 'A senha deve conter pelo menos um número')
//   .regex(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter pelo menos um caractere especial');

// Name validation schema
export const nameSchema = z
  .string()
  .min(1, "Nome é obrigatório")
  .min(2, "Nome deve ter pelo menos 2 caracteres")
  .max(100, "Nome é muito longo")
  .regex(/^[a-zA-ZÀ-ÿ\s]*$/, "Nome deve conter apenas letras e espaços");

// Complete login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Complete registration form schema
export const registrationSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;

// Real-time validation helpers
export const validateEmailRealTime = (email: string): string | null => {
  try {
    emailSchema.parse(email);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || "Email inválido";
    }
    return "Erro de validação";
  }
};

export const validatePasswordRealTime = (password: string): string | null => {
  try {
    passwordSchema.parse(password);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || "Senha inválida";
    }
    return "Erro de validação";
  }
};

export const validateNameRealTime = (name: string): string | null => {
  try {
    nameSchema.parse(name);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || "Nome inválido";
    }
    return "Erro de validação";
  }
};

// Format error messages from Zod validation
export const formatValidationErrors = (
  error: z.ZodError,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  error.issues.forEach((err) => {
    if (err.path.length > 0) {
      const field = err.path[0] as string;
      errors[field] = err.message;
    }
  });

  return errors;
};

// Get all password requirements status for UI feedback
export const getPasswordRequirements = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

// Check if password meets all requirements
export const isPasswordValid = (password: string): boolean => {
  const requirements = getPasswordRequirements(password);
  return Object.values(requirements).every(Boolean);
};
