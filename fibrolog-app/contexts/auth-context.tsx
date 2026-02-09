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
        const token = await storage.getItemAsync("fibrolog_access_token");
        const userEmail = await storage.getItemAsync("fibrolog_user_email");
        const userName = await storage.getItemAsync("fibrolog_user_name");

        if (!token) {
          setUsuario(null);
          return;
        }

        // Restaura sessão com dados armazenados
        setUsuario({
          id: "user",
          nome: userName || "Usuário",
          email: userEmail || "usuario@fibrolog.com",
        });
      } catch (erro) {
        setUsuario(null);
      } finally {
        setCarregandoSessao(false);
      }
    }

    restaurarSessao();
  }, []);

  async function signIn(credenciais: CredenciaisLogin): Promise<void> {
    const resultado = await authService.login(credenciais);
    await storage.setItemAsync("fibrolog_access_token", resultado.token);
    await storage.setItemAsync("fibrolog_user_email", credenciais.email);
    await storage.setItemAsync(
      "fibrolog_user_name",
      credenciais.email.split("@")[0],
    );

    setUsuario({
      id: "user",
      nome: credenciais.email.split("@")[0],
      email: credenciais.email,
    });
  }

  async function signUp(_dados: DadosCadastro): Promise<void> {
    const resultado = await authService.signup(_dados);
    await storage.setItemAsync("fibrolog_access_token", resultado.token);
    await storage.setItemAsync("fibrolog_user_email", _dados.email);
    await storage.setItemAsync("fibrolog_user_name", _dados.nome);

    setUsuario({
      id: "user",
      nome: _dados.nome,
      email: _dados.email,
    });
  }

  async function signOut(): Promise<void> {
    await storage.deleteItemAsync("fibrolog_access_token");
    await storage.deleteItemAsync("fibrolog_user_email");
    await storage.deleteItemAsync("fibrolog_user_name");
    setUsuario(null);
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
