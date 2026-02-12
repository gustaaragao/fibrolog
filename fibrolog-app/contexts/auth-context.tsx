import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "@/services/auth-service";
import { storage } from "@/utils/storage";

type Usuario = {
  id: string;
  nome: string;
  email: string;
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

type AuthContextValue = {
  usuario: Usuario | null;
  carregandoSessao: boolean;
  signIn: (credenciais: CredenciaisLogin) => Promise<void>;
  signUp: (dados: DadosCadastro) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      try {
        console.log("🔄 [Auth] Restaurando sessão...");
        const token = await storage.getItemAsync("fibrolog_access_token");
        const userEmail = await storage.getItemAsync("fibrolog_user_email");
        const userName = await storage.getItemAsync("fibrolog_user_name");

        if (!token) {
          console.log("⚠️ [Auth] Nenhum token encontrado no storage");
          setUsuario(null);
          return;
        }

        console.log(`✅ [Auth] Token encontrado: ${token.substring(0, 20)}...`);
        console.log(`👤 [Auth] Usuário: ${userName} (${userEmail})`);

        // Restaura sessão com dados armazenados
        setUsuario({
          id: "user",
          nome: userName || "Usuário",
          email: userEmail || "usuario@fibrolog.com",
        });
      } catch (error) {
        console.error("❌ [Auth] Erro ao restaurar sessão:", error);
        setUsuario(null);
      } finally {
        setCarregandoSessao(false);
      }
    }

    restaurarSessao();
  }, []);

  useEffect(() => {
    // Escuta evento de não autorizado disparado pela API
    const handleUnauthorized = () => {
      console.warn(
        "🚫 [Auth] Evento 'unauthorized' recebido - fazendo logout automático",
      );
      signOut();
    };

    if (
      typeof window !== "undefined" &&
      typeof window.addEventListener === "function"
    ) {
      window.addEventListener("fibrolog_unauthorized", handleUnauthorized);
    }

    return () => {
      if (
        typeof window !== "undefined" &&
        typeof window.removeEventListener === "function"
      ) {
        window.removeEventListener("fibrolog_unauthorized", handleUnauthorized);
      }
    };
  }, []);

  async function signIn(credenciais: CredenciaisLogin): Promise<void> {
    try {
      const resultado = await authService.login(credenciais);

      console.log("✅ [Auth] Login bem-sucedido, salvando token...");
      await storage.setItemAsync("fibrolog_access_token", resultado.token);
      await storage.setItemAsync("fibrolog_user_email", credenciais.email);
      await storage.setItemAsync(
        "fibrolog_user_name",
        credenciais.email.split("@")[0],
      );

      // Verifica se o token foi salvo corretamente
      const tokenSalvo = await storage.getItemAsync("fibrolog_access_token");
      console.log(
        `🔐 [Auth] Token salvo: ${tokenSalvo ? `Sim (${tokenSalvo.substring(0, 20)}...)` : "❌ NÃO"}`,
      );

      setUsuario({
        id: "user",
        nome: credenciais.email.split("@")[0],
        email: credenciais.email,
      });
    } catch (error) {
      console.error("❌ [Auth] Erro no login:", error);
      throw error;
    }
  }

  async function signUp(_dados: DadosCadastro): Promise<void> {
    console.log("✅ [Auth] Cadastro bem-sucedido, salvando token...");
    const resultado = await authService.signup(_dados);
    await storage.setItemAsync("fibrolog_access_token", resultado.token);
    await storage.setItemAsync("fibrolog_user_email", _dados.email);
    await storage.setItemAsync("fibrolog_user_name", _dados.nome);

    // Verifica se o token foi salvo corretamente
    const tokenSalvo = await storage.getItemAsync("fibrolog_access_token");
    console.log(
      `🔐 [Auth] Token salvo após cadastro: ${tokenSalvo ? `Sim (${tokenSalvo.substring(0, 20)}...)` : "❌ NÃO"}`,
    );

    setUsuario({
      id: "user",
      nome: _dados.nome,
      email: _dados.email,
    });
  }

  async function signOut(): Promise<void> {
    console.log("🚪 [Auth] Fazendo logout...");
    await storage.deleteItemAsync("fibrolog_access_token");
    await storage.deleteItemAsync("fibrolog_user_email");
    await storage.deleteItemAsync("fibrolog_user_name");
    setUsuario(null);
    console.log("✅ [Auth] Logout concluído");
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregandoSessao,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return contexto;
}
