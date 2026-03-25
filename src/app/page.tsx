export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Peluquería</h1>
        <p>Gana una recompensa refiriendo 4 personas.</p>
      </header>

      <div className="home-actions">
        <a href="/login" className="btn btn-primary">Iniciar Sesión</a>
        <a href="/register" className="btn btn-secondary">GENERA TU QR</a>
      </div>
    </div>
  );
}
