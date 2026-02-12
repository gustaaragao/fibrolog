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
    console.log(`🔐 [AuthService] Tentando login para: ${credenciais.email}`);
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

    console.log(`📥 [AuthService] Login response status: ${response.status}`);

    if (!response.ok) {
      let mensagem = "Não foi possível realizar o login.";

      try {
        const data = await response.json();
        if (data.detail) {
          mensagem = data.detail;
        }
      } catch {
        // Se não conseguir fazer parse do JSON, usar mensagem genérica
      }

      console.error(`❌ [AuthService] Erro no login: ${mensagem}`);
      throw new Error(mensagem);
    }

    const data = (await response.json()) as AuthTokenResponse;

    if (!data.access_token) {
      console.error("❌ [AuthService] Token de acesso não recebido");
      throw new Error("Token de acesso não recebido");
    }

    console.log(
      `✅ [AuthService] Login bem-sucedido, token recebido: ${data.access_token.substring(0, 20)}...`,
    );

    return {
      token: data.access_token,
      tipoToken: data.token_type,
    };
  } catch (erro) {
    // Tratar erros de rede/fetch
    if (erro instanceof TypeError) {
      throw new Error(
        `Não foi possível conectar ao servidor. Verifique se a API está rodando em ${API_BASE_URL}`,
      );
    }

    const mensagemBase =
      erro instanceof Error && erro.message
        ? erro.message
        : "Erro ao comunicar com o servidor de autenticação.";
    throw new Error(mensagemBase);
  }
}

type PacienteCriadoResponse = {
  id: number;
  nome: string;
  email: string;
};

async function signup(dados: DadosCadastro): Promise<ResultadoAuth> {
  console.log(`👤 [AuthService] Criando conta para: ${dados.email}`);
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
    console.log(`✅ [AuthService] Paciente criado com ID: ${criado.id}`);

    // Opcao simples: apos criar paciente, realizar login automatico
    console.log(`🔐 [AuthService] Fazendo login automático após cadastro...`);
    const resultadoLogin = await login({
      email: dados.email,
      senha: dados.senha,
    });

    return resultadoLogin;
  } catch (erro) {
    console.error(`❌ [AuthService] Erro no signup:`, erro);
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
