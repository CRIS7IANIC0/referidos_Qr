"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleConsume(referralId: string) {
    if (!confirm("¿Marcar este servicio como consumido?")) return;
    try {
      const res = await fetch("/api/admin/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralId })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRewardClaim(userId: string) {
    if (!confirm("¿Marcar recompensa como entregada al titular?")) return;
    try {
      const res = await fetch("/api/admin/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h3 style={{ marginBottom: "1.5rem", color: "var(--primary-color)" }}>Titulares y Referidos</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {users.map((user) => {
          const activeRefs = user.referrals.length;
          const consumedRefs = user.referrals.filter((r: any) => r.hasConsumedService).length;
          const canClaimReward = consumedRefs >= 4 && !user.rewardClaimed;

          return (
            <div key={user.id} className="glass-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <h4 style={{ fontSize: "1.2rem", color: "var(--text-color)" }}>{user.name}</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{user.email}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{consumedRefs} / 4 Consumidos</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{activeRefs} Invitados en total</div>
                </div>
              </div>

              {canClaimReward && (
                <div style={{ background: "rgba(212, 175, 55, 0.2)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--primary-color)", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--primary-color)", fontWeight: "bold" }}>¡Recompensa Lista para Entregar!</span>
                  <button onClick={() => handleRewardClaim(user.id)} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
                    Marcar Entregada
                  </button>
                </div>
              )}
              
              {user.rewardClaimed && (
                <div style={{ background: "rgba(76, 217, 100, 0.1)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--success-color)", marginBottom: "1rem", color: "var(--success-color)", fontWeight: "bold", textAlign: "center" }}>
                  Recompensa Entregada
                </div>
              )}

              {activeRefs > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)", textAlign: "left" }}>
                      <th style={{ padding: "0.5rem" }}>Referido</th>
                      <th style={{ padding: "0.5rem" }}>Email</th>
                      <th style={{ padding: "0.5rem" }}>Estado</th>
                      <th style={{ padding: "0.5rem", textAlign: "right" }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.referrals.map((ref: any) => (
                      <tr key={ref.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                        <td style={{ padding: "0.8rem 0.5rem" }}>{ref.referredName}</td>
                        <td style={{ padding: "0.8rem 0.5rem", color: "var(--text-muted)" }}>{ref.referredEmail}</td>
                        <td style={{ padding: "0.8rem 0.5rem" }}>
                          {ref.hasConsumedService ? (
                            <span style={{ color: "var(--success-color)" }}>Consumido</span>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>Pendiente</span>
                          )}
                        </td>
                        <td style={{ padding: "0.8rem 0.5rem", textAlign: "right" }}>
                          {!ref.hasConsumedService && (
                            <button 
                              onClick={() => handleConsume(ref.id)}
                              className="btn btn-secondary" 
                              style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                            >
                              Validar Consumo
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Sin referidos aún.</p>
              )}
            </div>
          );
        })}
        {users.length === 0 && <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No hay clientes registrados aún.</p>}
      </div>
    </div>
  );
}
