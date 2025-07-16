import React, { useState } from "react";
import { loginUser } from "../services/api";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await loginUser({ email, password });
      setResult("Login realizado com sucesso!");
    } catch {
      setResult("Erro ao fazer login");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" />
      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Entrar"}
      </Button>
      {result && <p>{result}</p>}
    </form>
  );
} 