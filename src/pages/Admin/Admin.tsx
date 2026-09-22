import { useState } from "react";
import AdminOrders from "../../components/Admin/AdminOrders";
import AdminProducts from "../../components/Admin/AdminProducts";
import AdminCategories from "../../components/Admin/AdminCategories";
import AdminUsers from "../../components/Admin/AdminUsers";
import "./admin.css";

export default function Admin() {
    const [activeSection, setActiveSection] = useState("dashboard");

    return (
        <main className="admin-page">

            <aside className="admin-sidebar">

                <h2 className="admin-sidebar-title">
                    Gravelya Admin
                </h2>

                <nav className="admin-nav">

                    <button
                        className={`admin-nav-button ${
                            activeSection === "dashboard" ? "active" : ""
                        }`}
                        onClick={() => setActiveSection("dashboard")}
                    >
                        🏠 Tableau de bord
                    </button>

                    <button
                        className={`admin-nav-button ${
                            activeSection === "orders" ? "active" : ""
                        }`}
                        onClick={() => setActiveSection("orders")}
                    >
                        🛒 Commandes
                    </button>

                    <button
                        className={`admin-nav-button ${
                            activeSection === "products" ? "active" : ""
                        }`}
                        onClick={() => setActiveSection("products")}
                    >
                        📦 Produits
                    </button>

                    <button
                        className={`admin-nav-button ${
                            activeSection === "categories" ? "active" : ""
                        }`}
                        onClick={() => setActiveSection("categories")}
                    >
                        🗂️ Catégories
                    </button>

                    <button
                        className={`admin-nav-button ${
                            activeSection === "users" ? "active" : ""
                        }`}
                        onClick={() => setActiveSection("users")}
                    >
                        👤 Utilisateurs
                    </button>

                </nav>

                <a
                    href="/"
                    className="admin-back-link"
                >
                    ← Retour au site
                </a>

            </aside>

            <section className="admin-content">

                {/* ========================================
                    TABLEAU DE BORD
                ======================================== */}

                {activeSection === "dashboard" && (
                    <>
                        <header className="admin-content-header">
                            <h1 className="main-title">
                                Tableau de bord
                            </h1>

                            <p>
                                Bienvenue dans l'administration de Gravelya Studio.
                            </p>
                        </header>

                        <section className="admin-stats">

                            <article className="admin-stat-card">
                                <span className="admin-stat-label">
                                    Commandes
                                </span>

                                <strong className="admin-stat-value">
                                    24
                                </strong>
                            </article>

                            <article className="admin-stat-card">
                                <span className="admin-stat-label">
                                    Produits
                                </span>

                                <strong className="admin-stat-value">
                                    37
                                </strong>
                            </article>

                            <article className="admin-stat-card">
                                <span className="admin-stat-label">
                                    Utilisateurs
                                </span>

                                <strong className="admin-stat-value">
                                    82
                                </strong>
                            </article>

                            <article className="admin-stat-card">
                                <span className="admin-stat-label">
                                    Chiffre d'affaires
                                </span>

                                <strong className="admin-stat-value">
                                    1 248,50 €
                                </strong>
                            </article>

                        </section>

                        <section className="admin-section">

                            <h2 className="sub-title">
                                À surveiller
                            </h2>

                            <div className="admin-alerts">

                                <div className="admin-alert">
                                    <span>🔴</span>
                                    <span>
                                        3 commandes en attente
                                    </span>
                                </div>

                                <div className="admin-alert">
                                    <span>🟠</span>
                                    <span>
                                        2 produits désactivés
                                    </span>
                                </div>

                                <div className="admin-alert">
                                    <span>🟡</span>
                                    <span>
                                        4 produits avec un stock faible
                                    </span>
                                </div>

                            </div>

                        </section>

                        <section className="admin-section">

                            <h2 className="sub-title">
                                Commandes récentes
                            </h2>

                            <div className="admin-orders">

                                <article className="admin-order">

                                    <div>
                                        <strong>#1042</strong>
                                        <span>Jean Dupont</span>
                                    </div>

                                    <span>
                                        42,00 €
                                    </span>

                                    <span className="admin-order-status">
                                        En cours
                                    </span>

                                </article>

                                <article className="admin-order">

                                    <div>
                                        <strong>#1041</strong>
                                        <span>Marie Martin</span>
                                    </div>

                                    <span>
                                        25,50 €
                                    </span>

                                    <span className="admin-order-status">
                                        Expédiée
                                    </span>

                                </article>

                                <article className="admin-order">

                                    <div>
                                        <strong>#1040</strong>
                                        <span>Paul Durand</span>
                                    </div>

                                    <span>
                                        68,00 €
                                    </span>

                                    <span className="admin-order-status">
                                        Terminée
                                    </span>

                                </article>

                            </div>

                        </section>
                    </>
                )}

                {/* ========================================
                    COMMANDES
                ======================================== */}

                {activeSection === "orders" && (
                    <AdminOrders />
                )}

                {/* ========================================
                    PRODUITS
                ======================================== */}

                {activeSection === "products" && (
                    <AdminProducts />
                )}

                {/* ========================================
                    CATÉGORIES
                ======================================== */}

                {activeSection === "categories" && (
                    <AdminCategories />
                )}

                {/* ========================================
                    UTILISATEURS
                ======================================== */}

                {activeSection === "users" && (
                    <AdminUsers />
                )}

            </section>

        </main>
    );
}