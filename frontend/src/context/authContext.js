import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useConnect } from "./connectContext";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const { disconnect } = useConnect();
  const login = (user) => {
    setUser(user);
  };
  const logout = () => {
    disconnect();
    setUser(null);
    navigate("/");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};