import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import BurgerIcon from "./BurgerIcon";
import CloseIcon from "./CloseIcon";
import logo_principal from "../../assets/logo_principal.png";
import "./header.css";

type PanelView = "full" | "cart" | "account" | null;

export default function Header() {
  const [panelView, setPanelView] = useState<PanelView>(null);

  const burgerBtnRef = useRef<HTMLButtonElement>(null);
  const cartBtnRef = useRef<HTMLButtonElement>(null);
  const accountBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openPanel = (
    view: Exclude<PanelView, null>,
    triggerRef: React.RefObject<HTMLButtonElement>
  ) => {
    lastTriggerRef.current = triggerRef.current;
    setPanelView(view);
  };

  const closePanel = () => {
    setPanelView(null);
    lastTriggerRef.current?.focus();
  };

  useEffect(() => {
    if (!panelView) return;

    closeBtnRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelView]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : undefined;

  return (
    <header>
      {/* Logo — inchangé, même taille sur mobile et desktop */}
      <Link to="/" className="header-logo">
        <img src={logo_principal} alt="Gravelya" />
      </Link>

      {/* Navigation desktop à gauche du logo */}
      <nav className="gvl-desktop-nav" aria-label="Navigation desktop">
        <NavLink to="/" className={navLinkClass}>
          Accueil
        </NavLink>

        <NavLink to="/produits" className={navLinkClass}>
          Produits
        </NavLink>
      </nav>

      {/* Panier mobile/tablette — inchangé */}
      <Link to="/panier" className="header-cart">
        Panier
      </Link>

      {/* Boutons desktop à droite du logo */}
      <div className="gvl-desktop-actions">
        <button
          type="button"
          ref={cartBtnRef}
          className="gvl-desktop-action-btn"
          aria-expanded={panelView === "cart"}
          onClick={() => openPanel("cart", cartBtnRef)}
        >
          Panier
        </button>

        <button
          type="button"
          ref={accountBtnRef}
          className="gvl-desktop-action-btn"
          aria-expanded={panelView === "account"}
          onClick={() => openPanel("account", accountBtnRef)}
        >
          Pas connecté ?
        </button>
      </div>

      {/* Burger — mobile uniquement, inchangé */}
      <button
        type="button"
        ref={burgerBtnRef}
        onClick={() => openPanel("full", burgerBtnRef)}
        aria-label="Ouvrir le menu"
        aria-expanded={panelView !== null}
        className="header-burger"
      >
        <BurgerIcon />
      </button>

      {panelView && (
        <div
          className="menu-overlay"
          onClick={closePanel}
          aria-hidden="true"
        />
      )}

      {/* Menu burger original : structure inchangée, contenu conditionné par panelView */}
      <nav
        aria-label="Menu principal"
        className={panelView ? "menu-open" : ""}
      >
        <button
          type="button"
          ref={closeBtnRef}
          onClick={closePanel}
          aria-label="Fermer le menu"
        >
          <CloseIcon />
        </button>

        {panelView === "full" && (
          <>
            <NavLink to="/" className={navLinkClass} onClick={closePanel}>
              Accueil
            </NavLink>

            <NavLink
              to="/produits"
              className={navLinkClass}
              onClick={closePanel}
            >
              Produits
            </NavLink>

            <Link
              to="/panier"
              className="header-cart-mobile"
              onClick={closePanel}
            >
              Panier
            </Link>

            <hr />

            <span>Pas connecté ?</span>

            <NavLink
              to="/connexion"
              className={navLinkClass}
              onClick={closePanel}
            >
              Se connecter
            </NavLink>

            <NavLink
              to="/connexion"
              className={navLinkClass}
              onClick={closePanel}
            >
              Créer un compte
            </NavLink>
          </>
        )}

        {panelView === "cart" && (
          <Link to="/panier" onClick={closePanel}>
            Voir mon panier
          </Link>
        )}

        {panelView === "account" && (
          <>
            <span>Pas connecté ?</span>

            <NavLink
              to="/connexion"
              className={navLinkClass}
              onClick={closePanel}
            >
              Se connecter
            </NavLink>

            <NavLink
              to="/connexion"
              className={navLinkClass}
              onClick={closePanel}
            >
              Créer un compte
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}