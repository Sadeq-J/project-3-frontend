import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, logout } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        if (storedUser) {
          localStorage.removeItem("user");
        }
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
