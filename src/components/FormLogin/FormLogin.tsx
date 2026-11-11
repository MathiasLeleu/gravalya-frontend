import { type SubmitEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api";
import { useAuthStore } from "../../store";

export default function FormLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const sessionExpired = useAuthStore(
    (state) => state.sessionExpired
  );
  const clearSessionExpired = useAuthStore(
    (state) => state.clearSessionExpired
  );

  const displayedError = sessionExpired
    ? "Session expirée. Veuillez vous reconnecter."
    : error;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    clearSessionExpired();

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

      window.dispatchEvent(new Event("auth:login-success"));

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

      {displayedError && (
        <p className="auth-error">{displayedError}</p>
      )}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}