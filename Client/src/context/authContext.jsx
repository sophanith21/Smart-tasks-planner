import { createContext, useState, useEffect } from "react";
import { getToken, getAuthUser, isAuthenticated, logout } from "../utils/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (token && isAuthenticated()) {
      setAuth(getAuthUser());
    } else {
      setAuth(null);
      logout();
    }
    setLoading(false);
  }, []);

  const value = {
    auth,
    setAuth,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
