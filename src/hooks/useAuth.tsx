import api from "@/utils/api";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthProviderContextProps {
  user?: User;
  authToken: string | null;
  register: (data: any) => void;
  login: (data: any) => void;
  signOut: () => void;
  getAuthToken: () => void;
  isTokenAvailable: boolean;
  authenticatedPage: (route?: string) => void;
}

export interface User {
  name: string;
  email: string;
}

const AuthProviderContext = createContext<AuthProviderContextProps>(
  {} as AuthProviderContextProps
);

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [isTokenAvailable, setIsTokenAvailable] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | undefined>();
  const router = useRouter();

  const getAuthToken = () => {
    if (window) {
      const token = window.localStorage.getItem("auth-token");
      if (token) {
        setAuthToken(token);
        setIsTokenAvailable(true);
      }

      return token;
    }
  };

  const authenticatedPage = (route = "/user") => {
    if (!authToken && !isTokenAvailable) {
      router.push(route);
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.post("Login/Register", data);
      if (window) {
        window.localStorage.setItem("auth-token", res.data.token);
      }
      setUser({
        name: data.name,
        email: data.email,
      });
      router.push("/");
      setAuthToken(res.data.token);
    } catch (ex: any) {
      console.error(ex);
    }
  };

  const login = async (data: any) => {
    try {
      const res = await api.post("Login", data);
      if (window) {
        window.localStorage.setItem("auth-token", res.data.token);
      }

      if (data && res.data.name && data.email) {
        setUser({
          name: res.data.name,
          email: data.email,
        });
        router.push("/");
        setAuthToken(res.data.token);
      }
    } catch (ex: any) {
      console.error(ex);
    }
  };

  const signOut = () => {
    window.localStorage.removeItem("auth-token");
    setUser(undefined);
    setAuthToken(null);
    router.push("/user");
  };

  useEffect(() => {
    setIsTokenAvailable(false);
    getAuthToken();
  }, [authToken]);

  return (
    <AuthProviderContext.Provider
      value={{
        user,
        authToken,
        register,
        login,
        signOut,
        getAuthToken,
        isTokenAvailable,
        authenticatedPage,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
};

export const useAuth = (): AuthProviderContextProps => {
  const context = useContext(AuthProviderContext);

  return { ...context };
};
