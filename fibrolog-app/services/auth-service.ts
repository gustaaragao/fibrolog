import { API_BASE_URL } from "@/constants/api";
import { api } from "@/services/api";

type AuthTokenResponse = {
  access_token: string;
  token_type: string;
};

type CredenciaisLogin = {
  email: string;
  senha: string;
};

type DadosCadastro = {
  nome: string;
  email: string;
  senha: string;
  data_nascimento: string;
  sexo: string;
  data_diagnostico: string;
};

export type ResultadoAuth = {
  token: string;
  tipoToken: string;
};

async function login(credenciais: CredenciaisLogin): Promise<ResultadoAuth> {
  try {
    const body = new URLSearchParams();
    body.append("username", credenciais.email);
    body.append("password", credenciais.senha);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = (await response.json()) as
      | AuthTokenResponse
      | { detail?: string };

    const detalheErro = "detail" in data ? data.detail : undefined;

    if (!response.ok) {
      const mensagem = detalheErro || "Nao foi possivel realizar o login.";
      throw new Error(mensagem);
    }

    return {
      token: (data as AuthTokenResponse).access_token,
      tipoToken: (data as AuthTokenResponse).token_type,
    };
  } catch (erro) {
    const mensagemBase =
      erro instanceof Error && erro.message
        ? erro.message
        : "Erro ao comunicar com o servidor de autenticacao.";
    throw new Error(mensagemBase);
  }
}

type PacienteCriadoResponse = {
  id: number;
  nome: string;
  email: string;
};

async function signup(dados: DadosCadastro): Promise<ResultadoAuth> {
  const body = {
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    data_nascimento: dados.data_nascimento,
    sexo: dados.sexo,
    data_diagnostico: dados.data_diagnostico,
  };

  try {
    const criado = await api.post<PacienteCriadoResponse>("/pacientes/", body);

    // Opcao simples: apos criar paciente, realizar login automatico
    const resultadoLogin = await login({
      email: dados.email,
      senha: dados.senha,
    });

    return resultadoLogin;
  } catch (erro) {
    const mensagemBase =
      erro instanceof Error && erro.message
        ? erro.message
        : "Nao foi possivel criar a conta. Verifique os dados informados.";
    throw new Error(mensagemBase);
  }
}

export const authService = {
  login,
  signup,
};
