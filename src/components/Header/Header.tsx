import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import BurgerIcon from "./BurgerIcon";
import CloseIcon from "./CloseIcon";
import logo_principal from "../../assets/logo_principal.png";
import styles from "./header.module.css";

import CartDrawer from "../CartDrawer/CartDrawer";
import { useAuthStore } from "../../store";

type PanelView = "full" | "account" | null;

export default function Header() {
  const [panelView, setPanelView] = useState<PanelView>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const burgerBtnRef = useRef<HTMLButtonElement>(null);
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

  const handleLogout = () => {
    logout();
    closePanel();
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

  useEffect(() => {
    if (!isCartOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [isCartOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : undefined;

  return (
    <header className={styles.header}>
      {/* Logo — inchangé, même taille sur mobile et desktop */}
      <Link to="/" className={styles["header-logo"]}>
        <img src={logo_principal} alt="Gravelya" />
      </Link>

      {/* Navigation desktop à gauche du logo */}
      <nav
        className={styles["gvl-desktop-nav"]}
        aria-label="Navigation desktop"
      >
        <NavLink to="/" className={navLinkClass}>
          Accueil
        </NavLink>

        <NavLink to="/produits" className={navLinkClass}>
          Produits
        </NavLink>
      </nav>

      {/* Panier mobile/tablette — inchangé */}
      <button
        type="button"
        className={styles["header-cart"]}
        onClick={() => setIsCartOpen(true)}
      >
        Panier
      </button>

      {/* Boutons desktop à droite du logo */}
      <div className={styles["gvl-desktop-actions"]}>
        <button
          type="button"
          className={styles["gvl-desktop-action-btn"]}
          aria-expanded={isCartOpen}
          onClick={() => setIsCartOpen(true)}
        >
          Panier
        </button>

        <button
          type="button"
          ref={accountBtnRef}
          className={styles["gvl-desktop-action-btn"]}
          aria-expanded={panelView === "account"}
          onClick={() => openPanel("account", accountBtnRef)}
        >
          {user ? user.firstName : "Pas connecté ?"}
        </button>
      </div>

      {/* Burger — mobile uniquement, inchangé */}
      <button
        type="button"
        ref={burgerBtnRef}
        onClick={() => openPanel("full", burgerBtnRef)}
        aria-label="Ouvrir le menu"
        aria-expanded={panelView !== null}
        className={styles["header-burger"]}
      >
        <BurgerIcon />
      </button>

      {panelView && (
        <div
          className={styles["menu-overlay"]}
          onClick={closePanel}
          aria-hidden="true"
        />
      )}

      {/* Menu burger */}
      <nav
        aria-label="Menu principal"
        className={panelView ? styles["menu-open"] : ""}
      >
        <button
          type="button"
          ref={closeBtnRef}
          onClick={closePanel}
          aria-label="Fermer le menu"
          className={styles["menu-close"]}
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

            <button
              className={styles["header-cart-mobile"]}
              onClick={() => {
                closePanel();
                setIsCartOpen(true);
              }}
            >
              Panier
            </button>

            <hr />

            {user ? (
              <>
                <span>Bonjour {user.firstName}</span>

                <NavLink
                  to="/profil"
                  className={navLinkClass}
                  onClick={closePanel}
                >
                  Mon profil
                </NavLink>

                <NavLink
                  to="/mes-commandes"
                  className={navLinkClass}
                  onClick={closePanel}
                >
                  Mes commandes
                </NavLink>

                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={navLinkClass}
                    onClick={closePanel}
                  >
                    Administration
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </button>
              </>
            ) : (
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
          </>
        )}

        {panelView === "account" && (
          <>
            {user ? (
              <>
                <span>Bonjour {user.firstName}</span>

                <NavLink
                  to="/profil"
                  className={navLinkClass}
                  onClick={closePanel}
                >
                  Mon profil
                </NavLink>

                <NavLink
                  to="/mes-commandes"
                  className={navLinkClass}
                  onClick={closePanel}
                >
                  Mes commandes
                </NavLink>

                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={navLinkClass}
                    onClick={closePanel}
                  >
                    Administration
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </button>
              </>
            ) : (
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
          </>
        )}
      </nav>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </header>
  );
}