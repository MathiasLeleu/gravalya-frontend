import "./admin-users.css";

export default function AdminUsers() {
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
                    />

                    <select
                        defaultValue="all"
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

                <article className="admin-user-card">

                    <div className="admin-user-avatar">
                        JD
                    </div>

                    <div className="admin-user-info">

                        <h2>
                            Jean Dupont
                        </h2>

                        <span>
                            jean.dupont@example.com
                        </span>

                        <small>
                            Inscrit le 15/09/2026
                        </small>

                    </div>

                    <span className="admin-user-role user">
                        Client
                    </span>

                    <span className="admin-user-status active">
                        Actif
                    </span>

                    <div className="admin-user-actions">

                        <button className="admin-edit-button">
                            Voir le profil
                        </button>

                        <button className="admin-delete-button">
                            Désactiver
                        </button>

                    </div>

                </article>

                <article className="admin-user-card">

                    <div className="admin-user-avatar">
                        MM
                    </div>

                    <div className="admin-user-info">

                        <h2>
                            Marie Martin
                        </h2>

                        <span>
                            marie.martin@example.com
                        </span>

                        <small>
                            Inscrite le 12/09/2026
                        </small>

                    </div>

                    <span className="admin-user-role user">
                        Client
                    </span>

                    <span className="admin-user-status active">
                        Actif
                    </span>

                    <div className="admin-user-actions">

                        <button className="admin-edit-button">
                            Voir le profil
                        </button>

                        <button className="admin-delete-button">
                            Désactiver
                        </button>

                    </div>

                </article>

                <article className="admin-user-card">

                    <div className="admin-user-avatar">
                        PL
                    </div>

                    <div className="admin-user-info">

                        <h2>
                            Paul Legrand
                        </h2>

                        <span>
                            paul.legrand@example.com
                        </span>

                        <small>
                            Inscrit le 08/09/2026
                        </small>

                    </div>

                    <span className="admin-user-role admin">
                        Administrateur
                    </span>

                    <span className="admin-user-status active">
                        Actif
                    </span>

                    <div className="admin-user-actions">

                        <button className="admin-edit-button">
                            Voir le profil
                        </button>

                        <button className="admin-delete-button">
                            Désactiver
                        </button>

                    </div>

                </article>

                <article className="admin-user-card">

                    <div className="admin-user-avatar">
                        PD
                    </div>

                    <div className="admin-user-info">

                        <h2>
                            Pierre Durand
                        </h2>

                        <span>
                            pierre.durand@example.com
                        </span>

                        <small>
                            Inscrit le 02/09/2026
                        </small>

                    </div>

                    <span className="admin-user-role user">
                        Client
                    </span>

                    <span className="admin-user-status inactive">
                        Inactif
                    </span>

                    <div className="admin-user-actions">

                        <button className="admin-edit-button">
                            Voir le profil
                        </button>

                        <button className="admin-delete-button">
                            Réactiver
                        </button>

                    </div>

                </article>

            </div>

        </section>
    );
}