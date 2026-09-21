import { Link } from "react-router-dom";
import "./orderconfirmation.css";

export default function OrderConfirmation() {
    return (
        <main className="order-confirmation-page">
            <section className="order-confirmation">
                <div className="order-confirmation-icon" aria-hidden="true">
                    ✓
                </div>

                <header className="order-confirmation-header">
                    <h1 className="main-title">
                        Merci pour votre commande !
                    </h1>

                    <p>
                        Votre commande a bien été enregistrée.
                    </p>

                    <p>
                        Un e-mail de confirmation vous sera envoyé
                        prochainement.
                    </p>
                </header>

                <div className="order-confirmation-number">
                    <span>Numéro de commande</span>
                    <strong>CMD-TEST-001</strong>
                </div>

                <div className="order-confirmation-summary">
                    <div className="order-confirmation-row">
                        <span>Montant de la commande</span>
                        <strong>34,90 €</strong>
                    </div>

                    <div className="order-confirmation-row">
                        <span>Livraison</span>
                        <strong>3,50 €</strong>
                    </div>

                    <div className="order-confirmation-row">
                        <span>Mode de livraison</span>
                        <strong>Chronopost — Domicile</strong>
                    </div>
                </div>

                <div className="order-confirmation-actions">
                    <Link
                        to="/mes-commandes"
                        className="order-confirmation-button"
                    >
                        Voir mes commandes
                    </Link>

                    <Link
                        to="/"
                        className="order-confirmation-link"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </section>
        </main>
    );
}