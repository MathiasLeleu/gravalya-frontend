import "./admin-orders.css";

export default function AdminOrders() {
    return (
        <section className="admin-orders-page">

            <header className="admin-section-header">
                <h1 className="main-title">Commandes</h1>

                <p>
                    Gérez les commandes passées sur Gravelya Studio.
                </p>
            </header>

            <div className="admin-orders-filters">

                <input
                    type="search"
                    placeholder="Rechercher une commande..."
                    aria-label="Rechercher une commande"
                />

                <select defaultValue="all" aria-label="Filtrer par statut">
                    <option value="all">Toutes les commandes</option>
                    <option value="pending">En attente</option>
                    <option value="processing">En cours</option>
                    <option value="shipped">Expédiées</option>
                    <option value="completed">Terminées</option>
                    <option value="cancelled">Annulées</option>
                </select>

            </div>

            <div className="admin-orders-list">

                <article className="admin-order-card">

                    <div className="admin-order-main">
                        <strong>#1042</strong>

                        <div>
                            <span>Jean Dupont</span>
                            <small>22/09/2026</small>
                        </div>
                    </div>

                    <span className="admin-order-price">
                        42,00 €
                    </span>

                    <span className="admin-order-status processing">
                        En cours
                    </span>

                    <button className="admin-order-button">
                        Voir le détail
                    </button>

                </article>

                <article className="admin-order-card">

                    <div className="admin-order-main">
                        <strong>#1041</strong>

                        <div>
                            <span>Marie Martin</span>
                            <small>21/09/2026</small>
                        </div>
                    </div>

                    <span className="admin-order-price">
                        25,50 €
                    </span>

                    <span className="admin-order-status shipped">
                        Expédiée
                    </span>

                    <button className="admin-order-button">
                        Voir le détail
                    </button>

                </article>

                <article className="admin-order-card">

                    <div className="admin-order-main">
                        <strong>#1040</strong>

                        <div>
                            <span>Paul Durand</span>
                            <small>20/09/2026</small>
                        </div>
                    </div>

                    <span className="admin-order-price">
                        68,00 €
                    </span>

                    <span className="admin-order-status completed">
                        Terminée
                    </span>

                    <button className="admin-order-button">
                        Voir le détail
                    </button>

                </article>

            </div>

        </section>
    );
}