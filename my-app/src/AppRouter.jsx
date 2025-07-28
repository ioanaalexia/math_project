import { useState, useEffect } from "react";
import App from "./App";
import LoginSignUp from "./LoginSignUp";

function AppRouter() {
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
      "Authorization": `Bearer ${token}`,
    },
  })
    .then(res => {
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    })
    .catch(() => {
      sessionStorage.removeItem("token");
      setIsAuthenticated(false);
    })
    .finally(() => setLoading(false));
}, []);


  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (loading) return null;

  return isAuthenticated ? <App /> : <LoginSignUp onLoginSuccess={handleLoginSuccess} />;
}

export default AppRouter;
