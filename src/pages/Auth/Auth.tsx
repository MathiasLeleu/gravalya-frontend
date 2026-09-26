import FormAuth from "../../components/FormAuth/FormAuth.tsx";
import FormLogin from "../../components/FormLogin/FormLogin.tsx";
import "./auth.css";

export default function Auth() {
  return (
    <main className="auth-page">
      <section className="auth-container">
        <div className="auth-card">
          <h1 className="main-title">Créer un compte</h1>

          <FormAuth />
        </div>

        <div className="auth-card">
          <h2 className="sub-title">Se connecter</h2>

          <FormLogin />
        </div>
      </section>
    </main>
  );
}