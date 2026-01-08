import { createContext, useContext, useState } from "react";
import { login as loginApi } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (formData) => {
    const res = await loginApi(formData);
    localStorage.setItem("token", res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
