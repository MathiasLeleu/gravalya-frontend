import { type SubmitEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api";
import { useAuthStore } from "../../store";

export default function FormLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const sessionExpired = useAuthStore(
    (state) => state.sessionExpired
  );
  const clearSessionExpired = useAuthStore(
    (state) => state.clearSessionExpired
  );

  useEffect(() => {
    if (sessionExpired) {
      setError("Session expirée. Veuillez vous reconnecter.");
      clearSessionExpired();
    }
  }, [sessionExpired, clearSessionExpired]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("L'adresse email et le mot de passe sont requis.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      login(data);

      setSuccess("Connexion réussie.");

      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur est survenue lors de la connexion.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="login-email">Adresse email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="login-password">Mot de passe</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
      </div>

      {error && <p className="auth-error">{error}</p>}

      {success && <p className="auth-success">{success}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}