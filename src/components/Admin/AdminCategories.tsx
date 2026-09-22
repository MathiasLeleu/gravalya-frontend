import "./admin-categories.css";

export default function AdminCategories() {
    return (
        <section className="admin-categories-page">

            <header className="admin-section-header">
                <h1 className="main-title">
                    Catégories
                </h1>

                <p>
                    Gérez les catégories de Gravelya Studio.
                </p>
            </header>

            <div className="admin-categories-actions">

                <div className="admin-categories-filters">

                    <input
                        type="search"
                        placeholder="Rechercher une catégorie..."
                        aria-label="Rechercher une catégorie"
                    />

                    <select
                        defaultValue="all"
                        aria-label="Filtrer par statut"
                    >
                        <option value="all">
                            Toutes les catégories
                        </option>

                        <option value="active">
                            Actives
                        </option>

                        <option value="inactive">
                            Inactives
                        </option>

                    </select>

                </div>

                <button className="admin-add-button">
                    + Ajouter une catégorie
                </button>

            </div>

            <div className="admin-categories-list">

                <article className="admin-category-card">

                    <div className="admin-category-image">
                        <span>Image</span>
                    </div>

                    <div className="admin-category-info">

                        <h2>
                            Gravure
                        </h2>

                        <p>
                            Créations gravées et personnalisées.
                        </p>

                        <span className="admin-category-products">
                            12 produits
                        </span>

                    </div>

                    <span className="admin-category-status active">
                        Active
                    </span>

                    <div className="admin-category-actions">

                        <button className="admin-edit-button">
                            Modifier
                        </button>

                        <button className="admin-delete-button">
                            Supprimer
                        </button>

                    </div>

                </article>

                <article className="admin-category-card">

                    <div className="admin-category-image">
                        <span>Image</span>
                    </div>

                    <div className="admin-category-info">

                        <h2>
                            Impression 3D
                        </h2>

                        <p>
                            Objets et décorations imprimés en 3D.
                        </p>

                        <span className="admin-category-products">
                            8 produits
                        </span>

                    </div>

                    <span className="admin-category-status active">
                        Active
                    </span>

                    <div className="admin-category-actions">

                        <button className="admin-edit-button">
                            Modifier
                        </button>

                        <button className="admin-delete-button">
                            Supprimer
                        </button>

                    </div>

                </article>

                <article className="admin-category-card">

                    <div className="admin-category-image">
                        <span>Image</span>
                    </div>

                    <div className="admin-category-info">

                        <h2>
                            Sublimation
                        </h2>

                        <p>
                            Textiles, badges, coques et stickers personnalisés.
                        </p>

                        <span className="admin-category-products">
                            6 produits
                        </span>

                    </div>

                    <span className="admin-category-status active">
                        Active
                    </span>

                    <div className="admin-category-actions">

                        <button className="admin-edit-button">
                            Modifier
                        </button>

                        <button className="admin-delete-button">
                            Supprimer
                        </button>

                    </div>

                </article>

                <article className="admin-category-card">

                    <div className="admin-category-image">
                        <span>Image</span>
                    </div>

                    <div className="admin-category-info">

                        <h2>
                            Gaming
                        </h2>

                        <p>
                            Créations autour de l'univers du gaming.
                        </p>

                        <span className="admin-category-products">
                            0 produit
                        </span>

                    </div>

                    <span className="admin-category-status inactive">
                        Inactive
                    </span>

                    <div className="admin-category-actions">

                        <button className="admin-edit-button">
                            Modifier
                        </button>

                        <button className="admin-activate-button">
                            Activer
                        </button>

                    </div>

                </article>

            </div>

        </section>
    );
}