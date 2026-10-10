import { useEffect, useState } from "react";
import { getUsers, getUserById, deleteUser } from "../../api";
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

        const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
        const [deleteError, setDeleteError] = useState("");
        const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

        const [isUserModalOpen, setIsUserModalOpen] = useState(false);

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
            setSelectedUser(null);
            setIsUserModalOpen(true);
            setLoadingUser(true);
            setUserError("");

            try {
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
            setIsUserModalOpen(false);
            setSelectedUser(null);
            setUserError("");
        };

        const handleDeleteUser = async () => {
            if (!userToDelete || deletingUserId !== null) {
                return;
            }

            const user = userToDelete;

            setDeletingUserId(user.id);
            setDeleteError("");

            try {
                await deleteUser(user.id);

                setUsers((currentUsers) =>
                    currentUsers.filter((currentUser) => currentUser.id !== user.id)
                );

                if (selectedUser?.id === user.id) {
                    closeUserDetails();
                }

                setUserToDelete(null);
            } catch (error) {
                setDeleteError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de supprimer cet utilisateur."
                );
            } finally {
                setDeletingUserId(null);
            }
        };

        useEffect(() => {
            if (!isUserModalOpen) return;

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    setIsUserModalOpen(false);
                    setSelectedUser(null);
                    setUserError("");
                }
            };

            window.addEventListener("keydown", handleKeyDown);

            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }, [isUserModalOpen]);

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

                {deleteError && (
                    <p className="admin-users-error" role="alert">
                        {deleteError}
                    </p>
                )}


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

                            <button
                                className="admin-delete-button"
                                onClick={() => {
                                    setDeleteError("");
                                    setUserToDelete(user);
                                }}
                                disabled={deletingUserId !== null}
                            >
                                {deletingUserId === user.id
                                    ? "Suppression..."
                                    : "Supprimer"}
                            </button>

                        </div>

                    </article>
                ))}

            </div>

            {isUserModalOpen && (
                <div
                    className="admin-user-modal-overlay"
                    onClick={closeUserDetails}
                >
                    <div
                        className="admin-user-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="admin-user-modal-close"
                            onClick={closeUserDetails}
                            aria-label="Fermer la fenêtre"
                        >
                            ×
                        </button>

                        {loadingUser && (
                            <p>Chargement du profil utilisateur...</p>
                        )}

                        {!loadingUser && userError && (
                            <p role="alert">{userError}</p>
                        )}

                        {!loadingUser && !userError && selectedUser && (
                            <>
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

                                <h3>Commandes</h3>

                                {selectedUser.orders.length === 0 ? (
                                    <p>Aucune commande.</p>
                                ) : (
                                    <div>
                                        {selectedUser.orders.map((order) => (
                                            <div key={order.id}>
                                                <strong>{order.orderNumber}</strong>
                                                <span> — {order.amount} €</span>
                                                <span> — {order.statut}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            
            {userToDelete && (
                <div
                    className="admin-user-modal-overlay"
                    onClick={() => {
                        if (deletingUserId === null) {
                            setUserToDelete(null);
                            setDeleteError("");
                        }
                    }}
                >
                    <div
                        className="admin-user-modal admin-user-delete-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-user-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="admin-user-modal-close"
                            onClick={() => {
                                setUserToDelete(null);
                                setDeleteError("");
                            }}
                            disabled={deletingUserId !== null}
                            aria-label="Annuler la suppression"
                        >
                            ×
                        </button>

                        <h2 id="delete-user-title">
                            Supprimer cet utilisateur ?
                        </h2>

                        <p>
                            Voulez-vous vraiment supprimer le compte de{" "}
                            <strong>
                                {userToDelete.firstName} {userToDelete.lastName}
                            </strong>
                            ?
                        </p>

                        <p className="admin-user-delete-warning">
                            Cette action est définitive.
                        </p>

                        {deleteError && (
                            <p className="admin-users-error" role="alert">
                                {deleteError}
                            </p>
                        )}

                        <div className="admin-user-delete-actions">
                            <button
                                type="button"
                                className="admin-edit-button"
                                onClick={() => {
                                    setUserToDelete(null);
                                    setDeleteError("");
                                }}
                                disabled={deletingUserId !== null}
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="admin-delete-button"
                                onClick={handleDeleteUser}
                                disabled={deletingUserId !== null}
                            >
                                {deletingUserId === userToDelete.id
                                    ? "Suppression..."
                                    : "Confirmer la suppression"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
}