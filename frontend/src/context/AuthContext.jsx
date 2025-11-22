import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("emr-user"))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("emr-token");
      if (token) {
        const { data } = await authService.getProfile();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("emr-token");
      localStorage.removeItem("emr-user");
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    setError(null);
    const data = await authService.login(identifier, password);
    if (data?.data?.user) setUser(data.data.user);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
