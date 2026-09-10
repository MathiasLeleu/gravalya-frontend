import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import BurgerIcon from "./BurgerIcon";
import CloseIcon from "./CloseIcon";
import logo_principal from "../../assets/logo_principal.png";
import banniere from "../../assets/banniere.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const burgerBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    closeBtnRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleClose = () => {
    closeMenu();
    burgerBtnRef.current?.focus();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : undefined;

  return (
    <header>
      {/* LOGO MOBILE */}
      <Link to="/" className="header-logo">
        <img src={logo_principal} alt="Gravelya" />
      </Link>

      {/* BANNIÈRE DESKTOP */}
      <Link to="/" className="header-banner">
        <img src={banniere} alt="Gravelya" />
      </Link>

      {/* PANIER HEADER */}
      <Link to="/panier" className="header-cart">
        Panier
      </Link>

      {/* BURGER MOBILE */}
      <button
        type="button"
        ref={burgerBtnRef}
        onClick={() => setMenuOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={menuOpen}
        className="header-burger"
      >
        <BurgerIcon />
      </button>

      {/* OVERLAY MOBILE */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* MENU */}
      <nav
        aria-label="Menu principal"
        className={menuOpen ? "menu-open" : ""}
      >
        {/* FERMER */}
        <button
          type="button"
          ref={closeBtnRef}
          onClick={handleClose}
          aria-label="Fermer le menu"
        >
          <CloseIcon />
        </button>

        {/* ACCUEIL */}
        <NavLink
          to="/"
          className={navLinkClass}
          onClick={handleClose}
        >
          Accueil
        </NavLink>

        {/* PRODUITS */}
        <NavLink
          to="/produits"
          className={navLinkClass}
          onClick={handleClose}
        >
          Produits
        </NavLink>

        {/* PANIER MOBILE */}
        <Link
          to="/panier"
          className="header-cart-mobile"
          onClick={handleClose}
        >
          Panier
        </Link>

        <hr />

        {/* COMPTE */}
        <span>Pas connecté ?</span>

        <NavLink
          to="/connexion"
          className={navLinkClass}
          onClick={handleClose}
        >
          Se connecter
        </NavLink>

        <NavLink
          to="/connexion"
          className={navLinkClass}
          onClick={handleClose}
        >
          Créer un compte
        </NavLink>
      </nav>
    </header>
  );
}