import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <nav className="footer-links" aria-label="Liens légaux">
        <Link to="/a-propos">À propos</Link>
        <Link to="/cgv">CGV</Link>
        <Link to="/politique-de-confidentialite">
          Politique de confidentialité
        </Link>
        <Link to="/mentions-legales">Mentions légales</Link>
      </nav>

      <p className="footer-copyright">
        © 2026 - Gravelya - Tous droits réservés
      </p>
    </footer>
  );
}