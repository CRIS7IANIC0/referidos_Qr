"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReferralForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/referral/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Error al registrarse");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="glass-panel" style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1.5rem", color: "var(--success-color)" }}>¡Registro Exitoso!</h2>
        <p>Tu registro como referido ha sido confirmado.</p>
        <p style={{ marginTop: "1rem" }}>¡Te esperamos en la peluquería para tu próximo servicio!</p>
        <div style={{ marginTop: "2rem" }}>
          <a href="/" className="btn btn-primary">Volver al Inicio</a>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ width: "100%", maxWidth: "400px" }}>
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "var(--primary-color)" }}>Registro de Referido</h2>
      <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        Ingresa tus datos para validar la invitación de tu amigo.
      </p>
      
      {error && <div style={{ color: "var(--error-color)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input type="hidden" name="referralCode" value={code} />
        
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
        
        <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: "1rem" }}>
          {loading ? "Registrando..." : "Confirmar Registro"}
        </button>
      </form>
    </div>
  );
}

export default function RegisterReferralPage() {
  return (
    <div className="home-container">
      <Suspense fallback={<div className="glass-panel">Cargando...</div>}>
        <ReferralForm />
      </Suspense>
    </div>
  );
}
