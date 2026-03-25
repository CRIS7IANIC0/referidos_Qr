import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div style={{ padding: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>
        <h2>Panel de Administración</h2>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>Modo Admin</span>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
