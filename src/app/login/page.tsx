"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-container">
      <div className="glass-panel" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "var(--primary-color)" }}>Iniciar Sesión</h2>
        
        {error && <div style={{ color: "var(--error-color)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Correo Electrónico</label>
            <input 
              type="email" 
              name="email" 
              required 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Contraseña</label>
            <input 
              type="password" 
              name="password" 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: "1rem" }}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
        
        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
          ¿No tienes cuenta? <a href="/register" style={{ color: "var(--primary-color)" }}>Regístrate aquí</a>
        </div>
      </div>
    </div>
  );
}
