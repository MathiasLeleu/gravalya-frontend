import { useState } from "react";
import AdminOrders from "../../components/Admin/AdminOrders";
import AdminProducts from "../../components/Admin/AdminProducts";
import AdminCategories from "../../components/Admin/AdminCategories";
import AdminUsers from "../../components/Admin/AdminUsers";
import AdminDashboard from "../../components/Admin/AdminDashboard";
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
                    <AdminDashboard />
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