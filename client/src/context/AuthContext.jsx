import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  loginWithGoogle,
  deleteCurrentUser,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser(token);
        setUser(res.user);
      } catch (error) {
        localStorage.removeItem("token");
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (data) => {
    const res = await registerUser(data);

    localStorage.setItem("token", res.token);

    setUser(res.user);

    return res;
  };

  const login = async (data) => {
    const res = await loginUser(data);

    localStorage.setItem("token", res.token);

    setUser(res.user);

    return res;
  };

  const googleLogin = async (credential, mode = "login") => {
    const res = await loginWithGoogle(credential, mode);

    localStorage.setItem("token", res.token);

    setUser(res.user);

    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No active session found");
    }

    const res = await deleteCurrentUser(token);

    localStorage.removeItem("token");
    setUser(null);

    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        googleLogin,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);