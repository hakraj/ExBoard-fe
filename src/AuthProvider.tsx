import { ReactNode, createContext, useState, useEffect, useContext } from "react";

type IUser = {
  reg_no: string, role: string, token: string
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
  user: { reg_no: "", role: "", token: "" },
  setUser: () => { },
  login: () => { },
  logout: () => { },
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(
    () => JSON.parse(sessionStorage.getItem("authenticated") || "false")
  );
  const [user, setUser] = useState<{ reg_no: string, role: string, token: string }>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { reg_no: "", role: "", token: "" };
  });

  const login = (userData: { reg_no: string, role: string, token: string }) => {
    setAuthenticated(true)
    setUser(userData);
  }

  const logout = () => {
    setAuthenticated(false)
    setUser({ reg_no: "", role: "", token: "" });
  }

  useEffect(() => {
    sessionStorage.setItem("authenticated", JSON.stringify(authenticated));
  }, [authenticated]);

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ authenticated, setAuthenticated, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);


export { useAuth, AuthProvider, };
