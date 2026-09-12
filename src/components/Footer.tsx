import { Link } from "react-router-dom";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61592864513292",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/gravelya.studio/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@gravelya.studio",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.36V2h-3.53v13.67a2.88 2.88 0 1 1-2.88-2.88c.3 0 .6.05.88.14V9.34a6.4 6.4 0 1 0 5.53 6.33V8.32a8.35 8.35 0 0 0 4.9 1.57V6.38c-.38 0-.76-.06-1.13-.17Z" />
      </svg>
    ),
  },
];

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

      <nav className="footer-socials" aria-label="Réseaux sociaux">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
          >
            {social.icon}
          </a>
        ))}
      </nav>

      <p className="footer-copyright">
        © 2026 - Gravelya - Tous droits réservés
      </p>
    </footer>
  );
}