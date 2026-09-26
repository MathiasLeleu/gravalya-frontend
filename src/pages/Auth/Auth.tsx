import FormAuthentification from "../../components/FormConnection/FormConnection.tsx";
import "./auth.css";

export default function Auth() {
  return (
    <main className="auth-page">
      <section className="auth-container">
        <h1 className="main-title">Créer un compte</h1>

        <FormAuthentification />
      </section>
    </main>
  );
}