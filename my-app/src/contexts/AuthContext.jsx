// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/logs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setIsAuthenticated(res.ok);
        if (!res.ok) sessionStorage.clear();
      })
      .catch(() => {
        sessionStorage.clear();
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = ({ token, name, email }) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("email", email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
