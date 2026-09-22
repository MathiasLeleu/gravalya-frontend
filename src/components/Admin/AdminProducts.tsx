import "./admin-products.css";

export default function AdminProducts() {
    return (
        <section className="admin-products-page">

            <header className="admin-section-header">
                <h1 className="main-title">
                    Produits
                </h1>

                <p>
                    Gérez les produits de Gravelya Studio.
                </p>
            </header>

            <div className="admin-products-actions">

                <div className="admin-products-filters">

                    <input
                        type="search"
                        placeholder="Rechercher un produit..."
                        aria-label="Rechercher un produit"
                    />

                    <select
                        defaultValue="all"
                        aria-label="Filtrer par catégorie"
                    >
                        <option value="all">
                            Toutes les catégories
                        </option>

                        <option value="gravure">
                            Gravure
                        </option>

                        <option value="impression-3d">
                            Impression 3D
                        </option>

                        <option value="sublimation">
                            Sublimation
                        </option>

                    </select>

                    <select
                        defaultValue="all"
                        aria-label="Filtrer par statut"
                    >
                        <option value="all">
                            Tous les produits
                        </option>

                        <option value="active">
                            Actifs
                        </option>

                        <option value="inactive">
                            Inactifs
                        </option>

                    </select>

                </div>

                <button className="admin-add-button">
                    + Ajouter un produit
                </button>

            </div>

            <div className="admin-products-list">

                <article className="admin-product-card">

                    <div className="admin-product-image">
                        <span>Image</span>
                    </div>

                    <div className="admin-product-info">

                        <h2>
                            Porte-clé personnalisé
                        </h2>

                        <span className="admin-product-category">
                            Gravure
                        </span>

                        <div className="admin-product-details">
                            <span>
                                8,90 €
                            </span>

                            <span>
                                Stock : 12
                            </span>
                        </div>

                    </div>

                    <span className="admin-product-status active">
                        Actif
                    </span>

                    <div className="admin-product-actions">

                        <button className="admin-edit-button">
                            Modifier
                        </button>

                        <button className="admin-delete-button">
                            Supprimer
                        </button>

                    </div>

                </article>

                <article className="admin-product-card">

                    <div className="admin-product-image">
                        <span>Image</span>
                    </div>

                    <div className="admin-product-info">

                        <h2>
                            Plaque de porte
                        </h2>

                        <span className="admin-product-category">
                            Gravure
                        </span>

                        <div className="admin-product-details">
                            <span>
                                24,90 €
                            </span>

                            <span>
                                Stock : 4
                            </span>
                        </div>

                    </div>

                    <span className="admin-product-status active">
                        Actif
                    </span>

                    <div className="admin-product-actions">

                        <button className="admin-edit-button">
                            Modifier
                        </button>

                        <button className="admin-delete-button">
                            Supprimer
                        </button>

                    </div>

                </article>

                <article className="admin-product-card">

                    <div className="admin-product-image">
                        <span>Image</span>
                    </div>

                    <div className="admin-product-info">

                        <h2>
                            Mug personnalisé
                        </h2>

                        <span className="admin-product-category">
                            Sublimation
                        </span>

                        <div className="admin-product-details">
                            <span>
                                15,90 €
                            </span>

                            <span>
                                Stock : 0
                            </span>
                        </div>

                    </div>

                    <span className="admin-product-status inactive">
                        Inactif
                    </span>

                    <div className="admin-product-actions">

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