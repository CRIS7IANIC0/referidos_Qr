"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Error al registrarse");
      }

      if (responseData.user.role === "ADMIN") {
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
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "var(--primary-color)" }}>Crear Cuenta</h2>
        
        {error && <div style={{ color: "var(--error-color)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Nombre Completo</label>
            <input 
              type="text" 
              name="name" 
              required 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Correo Electrónico</label>
            <input 
              type="email" 
              name="email" 
              required 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Teléfono (opcional)</label>
            <input 
              type="tel" 
              name="phone" 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Contraseña</label>
            <input 
              type="password" 
              name="password" 
              required 
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: "1rem" }}>
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>
        
        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
          ¿Ya tienes cuenta? <a href="/login" style={{ color: "var(--primary-color)" }}>Inicia sesión aquí</a>
        </div>
      </div>
    </div>
  );
}
