import axios from "axios";
import { ReactNode, createContext, useState, useEffect, useContext } from "react";

type IUser = {
  name: string; reg_no: string, role: string, token: string, exam_access?: string,
}

type IAuthContext = {
  authenticated: boolean;
  setAuthenticated: (newState: boolean) => void;
  user: IUser;
  setUser: (newState: IUser) => void;
  login: (userData: IUser) => void;
  logout: () => void;

};

const AuthContext = createContext<IAuthContext>({
  authenticated: false,
  setAuthenticated: () => { },
  user: { name: "", reg_no: "", role: "", token: "" },
  setUser: () => { },
  login: () => { },
  logout: () => { },
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(
    () => JSON.parse(sessionStorage.getItem("authenticated") || "false")
  );
  const [user, setUser] = useState<IUser>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { reg_no: "", role: "", token: "", exam_access: "" };
  });

  const login = (userData: IUser) => {
    setAuthenticated(true)
    setUser(userData);
  }

  const logout = () => {
    setAuthenticated(false)
    setUser({ name: "", reg_no: "", role: "", token: "", exam_access: "" });
  }

  useEffect(() => {
    sessionStorage.setItem("authenticated", JSON.stringify(authenticated));
  }, [authenticated]);

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout()
        }
        return Promise.reject(error)
      }
    )
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ authenticated, setAuthenticated, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);


export { useAuth, AuthProvider };
