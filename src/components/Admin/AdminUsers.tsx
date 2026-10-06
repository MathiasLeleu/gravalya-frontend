import { useEffect, useState } from "react";
import { getUsers, getUserById } from "../../api";
import type { IUser, IUserDetails } from "../../@types";

import "./admin-users.css";

export default function AdminUsers() {

        const [users, setUsers] = useState<IUser[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");

        const [search, setSearch] = useState("");
        const [roleFilter, setRoleFilter] = useState("all");

        const [selectedUser, setSelectedUser] = useState<IUserDetails | null>(null);
        const [loadingUser, setLoadingUser] = useState(false);
        const [userError, setUserError] = useState("");

        useEffect(() => {
            const loadUsers = async () => {
                try {
                    setLoading(true);
                    setError("");

                    const data = await getUsers();
                    setUsers(data);
                } catch (error) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Impossible de récupérer les utilisateurs."
                    );
                } finally {
                    setLoading(false);
                }
            };

            loadUsers();
        }, []);

        const filteredUsers = users.filter((user) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchValue) ||
                user.email.toLowerCase().includes(searchValue);

            const matchesRole =
                roleFilter === "all" || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });

        const handleViewUser = async (userId: number) => {
            try {
                setLoadingUser(true);
                setUserError("");

                const data = await getUserById(userId);
                setSelectedUser(data);
            } catch (error) {
                setUserError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de récupérer les informations de l'utilisateur."
                );
            } finally {
                setLoadingUser(false);
            }
        };

        const closeUserDetails = () => {
            setSelectedUser(null);
            setUserError("");
        };

    return (
        <section className="admin-users-page">

            <header className="admin-section-header">
                <h1 className="main-title">
                    Utilisateurs
                </h1>

                <p>
                    Gérez les utilisateurs de Gravelya Studio.
                </p>
            </header>

            <div className="admin-users-actions">

                <div className="admin-users-filters">

                    <input
                        type="search"
                        placeholder="Rechercher un utilisateur..."
                        aria-label="Rechercher un utilisateur"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <select
                        value={roleFilter}
                        onChange={(event) => setRoleFilter(event.target.value)}
                        aria-label="Filtrer par rôle"
                    >
                        <option value="all">
                            Tous les utilisateurs
                        </option>

                        <option value="user">
                            Clients
                        </option>

                        <option value="admin">
                            Administrateurs
                        </option>
                    </select>

                </div>

            </div>

            <div className="admin-users-list">


                {loading && (
                    <p>Chargement des utilisateurs...</p>
                )}

                {!loading && error && (
                    <p>{error}</p>
                )}

                {!loading && !error && filteredUsers.length === 0 && (
                    <p>Aucun utilisateur trouvé.</p>
                )}

                {!loading && !error && filteredUsers.map((user) => (
                    <article
                        className="admin-user-card"
                        key={user.id}
                    >

                        <div className="admin-user-avatar">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                        </div>

                        <div className="admin-user-info">

                            <h2>
                                {user.firstName} {user.lastName}
                            </h2>

                            <span>
                                {user.email}
                            </span>

                        </div>

                        <span className={`admin-user-role ${user.role}`}>
                            {user.role === "admin"
                                ? "Administrateur"
                                : "Client"}
                        </span>

                        <div className="admin-user-actions">

                            <button
                                className="admin-edit-button"
                                onClick={() => handleViewUser(user.id)}
                            >
                                Voir le profil
                            </button>

                            <button className="admin-delete-button">
                                Supprimer
                            </button>

                        </div>

                    </article>
                ))}

            </div>

            {selectedUser && (
                <div className="admin-user-modal-overlay">
                    <div className="admin-user-modal">

                        <button
                            className="admin-user-modal-close"
                            onClick={closeUserDetails}
                        >
                            ×
                        </button>

                        <h2>
                            {selectedUser.firstName} {selectedUser.lastName}
                        </h2>

                        <p>
                            <strong>Email :</strong> {selectedUser.email}
                        </p>

                        <p>
                            <strong>Rôle :</strong>{" "}
                            {selectedUser.role === "admin"
                                ? "Administrateur"
                                : "Client"}
                        </p>

                        <h3>
                            Commandes
                        </h3>

                        {selectedUser.orders.length === 0 ? (
                            <p>
                                Aucune commande.
                            </p>
                        ) : (
                            <div>
                                {selectedUser.orders.map((order) => (
                                    <div key={order.id}>
                                        <strong>
                                            {order.orderNumber}
                                        </strong>

                                        <span>
                                            {" "}— {order.amount} €
                                        </span>

                                        <span>
                                            {" "}— {order.statut}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            )}

        </section>
    );
}