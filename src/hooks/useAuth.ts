import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const login = (userData: any) => setUser(userData);
  const logout = () => setUser(null);
  return { user, login, logout };
} 