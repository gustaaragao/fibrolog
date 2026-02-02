import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { authService } from '@/services/auth-service';
import { api } from '@/services/api';
import { storage } from '@/utils/storage';

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
        const token = await storage.getItemAsync('fibrolog_access_token');

        if (!token) {
          setUsuario(null);
          return;
        }

        // Para simplificar, consideramos token valido e apenas restauramos email generico.
        // Em uma versao futura, podemos decodificar o JWT ou chamar um endpoint /me.
        setUsuario({
          id: 'restaurado',
          nome: 'Usuario',
          email: 'desconhecido@fibrolog',
        });
      } catch (erro) {
        console.error('Erro ao restaurar sessao:', erro);
      } finally {
        setCarregandoSessao(false);
      }
    }

    restaurarSessao();
  }, []);

  async function signIn(credenciais: CredenciaisLogin): Promise<void> {
    const resultado = await authService.login(credenciais);
    await storage.setItemAsync('fibrolog_access_token', resultado.token);

    try {
      // Busca dados reais do paciente
      const response = await api.get('/api/pacientes/me');
      setUsuario({
        id: response.data.id,
        nome: response.data.nome,
        email: response.data.email,
      });
    } catch (erro) {
      console.error('Erro ao buscar dados do paciente:', erro);
      // Fallback caso a API não responda
      setUsuario({
        id: 'temporario',
        nome: credenciais.email.split('@')[0],
        email: credenciais.email,
      });
    }
  }

  async function signUp(_dados: DadosCadastro): Promise<void> {
    const resultado = await authService.signup(_dados);

    setUsuario({
      id: 'temporario',
      nome: _dados.nome,
      email: _dados.email,
    });

    console.log('Token recebido apos cadastro:', resultado.token, resultado.tipoToken);
  }

  async function signOut(): Promise<void> {
    await storage.deleteItemAsync('fibrolog_access_token');
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
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return contexto;
}
