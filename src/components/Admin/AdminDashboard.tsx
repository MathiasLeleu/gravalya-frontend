import { useEffect, useState } from "react";
import { getAllOrders, getAdminProducts, getUsers } from "../../api";
import type { IProduct, IUser } from "../../@types";

import "./admin-dashboard.css";


type OrderStatus =
    | "EN_ATTENTE"
    | "CONFIRMEE"
    | "EXPEDIEE"
    | "LIVREE"
    | "ANNULEE";

type DashboardOrder = {
    id: number;
    orderNumber: string;
    statut: OrderStatus;
    amount: number | string;
    shippingCost: number | string;
    createdAt: string;
    shippingFirstName: string;
    shippingLastName: string;
};

const statusLabels: Record<OrderStatus, string> = {
    EN_ATTENTE: "En attente",
    CONFIRMEE: "Confirmée",
    EXPEDIEE: "Expédiée",
    LIVREE: "Livrée",
    ANNULEE: "Annulée",
};

function formatPrice(value: number) {
    return `${value.toFixed(2).replace(".", ",")} €`;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR");
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<DashboardOrder[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);
                setError("");

                const [ordersData, productsData, usersData] =
                    await Promise.all([
                        getAllOrders(),
                        getAdminProducts(),
                        getUsers(),
                    ]);

                setOrders(ordersData);
                setProducts(productsData);
                setUsers(usersData);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de charger le tableau de bord."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <section className="admin-dashboard">
                <p className="default-text">
                    Chargement du tableau de bord...
                </p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="admin-dashboard">
                <p className="default-text" role="alert">
                    {error}
                </p>
            </section>
        );
    }

    const revenue = orders
        .filter((order) => order.statut !== "ANNULEE")
        .reduce(
            (total, order) =>
                total +
                Number(order.amount) +
                Number(order.shippingCost),
            0
        );

    const pendingOrders = orders.filter(
        (order) => order.statut === "EN_ATTENTE"
    ).length;

    const inactiveProducts = products.filter(
        (product) => !product.active
    ).length;

    const lowStockProducts = products.filter(
        (product) =>
            product.active && product.stockQuantity <= 5
    ).length;

    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 3);

    return (
        <section className="admin-dashboard">
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
                        {orders.length}
                    </strong>
                </article>

                <article className="admin-stat-card">
                    <span className="admin-stat-label">
                        Produits
                    </span>

                    <strong className="admin-stat-value">
                        {products.length}
                    </strong>
                </article>

                <article className="admin-stat-card">
                    <span className="admin-stat-label">
                        Utilisateurs
                    </span>

                    <strong className="admin-stat-value">
                        {users.length}
                    </strong>
                </article>

                <article className="admin-stat-card">
                    <span className="admin-stat-label">
                        Chiffre d'affaires enregistré
                    </span>

                    <strong className="admin-stat-value">
                        {formatPrice(revenue)}
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
                            {pendingOrders} commande(s) en attente
                        </span>
                    </div>

                    <div className="admin-alert">
                        <span>🟠</span>
                        <span>
                            {inactiveProducts} produit(s) désactivé(s)
                        </span>
                    </div>

                    <div className="admin-alert">
                        <span>🟡</span>
                        <span>
                            {lowStockProducts} produit(s) avec un stock faible
                        </span>
                    </div>
                </div>
            </section>

            <section className="admin-section">
                <h2 className="sub-title">
                    Commandes récentes
                </h2>

                {recentOrders.length === 0 ? (
                    <p className="default-text">
                        Aucune commande pour le moment.
                    </p>
                ) : (
                    <div className="admin-orders">
                        {recentOrders.map((order) => (
                            <article
                                key={order.id}
                                className="admin-order"
                            >
                                <div>
                                    <strong>
                                        #{order.orderNumber}
                                    </strong>

                                    <span>
                                        {order.shippingFirstName}{" "}
                                        {order.shippingLastName}
                                    </span>

                                    <small>
                                        {formatDate(order.createdAt)}
                                    </small>
                                </div>

                                <span>
                                    {formatPrice(
                                        Number(order.amount) +
                                        Number(order.shippingCost)
                                    )}
                                </span>

                                <span className="admin-order-status">
                                    {statusLabels[order.statut]}
                                </span>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
}
