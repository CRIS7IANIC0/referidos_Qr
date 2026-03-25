import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import QRCodeWrapper from "./QRCodeWrapper";

export default async function DashboardPage() {
  const session = await getSession();
  
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      referrals: true
    }
  });

  if (!user) return <div>Usuario no encontrado</div>;

  const activeReferralsCount = user.referrals.length;
  const consumedReferralsCount = user.referrals.filter(r => r.hasConsumedService).length;
  
  // Calculate reward logically
  const hasReward = consumedReferralsCount >= 4;
  
  // Dynamic host for the QR code
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const referralLink = `${baseUrl}/register-referral?code=${user.referralCode}`;

  return (
    <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      
      {/* Código QR y Link */}
      <div className="glass-panel" style={{ textAlign: "center" }}>
        <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>Tu Código de Referido</h3>
        
        {hasReward ? (
          <div style={{ padding: "2rem", background: "rgba(76, 217, 100, 0.1)", borderRadius: "8px", border: "1px solid var(--success-color)", color: "var(--success-color)" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>¡Felicidades!</h2>
            <p>Has completado tus 4 referidos con servicio consumido.</p>
            {user.rewardClaimed ? (
              <p style={{ marginTop: "1rem", fontWeight: "bold" }}>Tu recompensa ya fue cobrada.</p>
            ) : (
              <p style={{ marginTop: "1rem" }}>Muestra esta pantalla en la peluquería para cobrar tu recompensa.</p>
            )}
          </div>
        ) : activeReferralsCount >= 4 ? (
          <div style={{ padding: "1rem", background: "rgba(255, 59, 48, 0.1)", borderRadius: "8px", border: "1px solid var(--error-color)", color: "var(--error-color)" }}>
            <p>Has alcanzado el límite máximo de 4 referidos invitados. ¡Espera a que consuman su servicio!</p>
          </div>
        ) : (
          <>
            <div style={{ background: "white", padding: "1rem", borderRadius: "12px", display: "inline-block", marginBottom: "1rem" }}>
              <QRCodeWrapper value={referralLink} size={200} />
            </div>
            <div style={{ background: "var(--surface-color)", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0", wordBreak: "break-all" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Código: <strong style={{color:"var(--primary-color)", fontSize:"1.2rem"}}>{user.referralCode}</strong></p>
              <a href={referralLink} style={{ color: "var(--primary-color)", fontSize: "0.9rem" }} target="_blank" rel="noreferrer">
                {referralLink}
              </a>
            </div>
          </>
        )}
      </div>

      {/* Progreso de Referidos */}
      <div className="glass-panel">
        <h3 style={{ marginBottom: "1rem", color: "var(--primary-color)" }}>Tus Referidos ({activeReferralsCount}/4)</h3>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>Servicios consumidos:</span>
            <span style={{ fontWeight: "bold", color: "var(--primary-color)" }}>{consumedReferralsCount} / 4</span>
          </div>
          <div style={{ width: "100%", background: "#e2e8f0", height: "10px", borderRadius: "5px", overflow: "hidden" }}>
            <div style={{ width: `${(consumedReferralsCount / 4) * 100}%`, background: "var(--primary-color)", height: "100%", transition: "width 0.3s ease" }}></div>
          </div>
        </div>

        {activeReferralsCount === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>Aún no has invitado a nadie. ¡Comparte tu código!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {user.referrals.map((ref) => (
              <div key={ref.id} style={{ padding: "1rem", background: "var(--surface-color)", borderRadius: "8px", border: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{ref.referredName}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{ref.referredEmail}</div>
                </div>
                <div>
                  {ref.hasConsumedService ? (
                    <span style={{ color: "var(--success-color)", fontSize: "0.8rem", background: "rgba(76, 217, 100, 0.1)", padding: "0.3rem 0.6rem", borderRadius: "12px", border: "1px solid var(--success-color)" }}>
                      Servicio Consumido
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", background: "#f1f5f9", padding: "0.3rem 0.6rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
