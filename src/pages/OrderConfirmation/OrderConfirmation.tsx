import { Link, useLocation } from "react-router-dom";
import "./orderconfirmation.css";

export default function OrderConfirmation() {

        const location = useLocation();

        const orderNumber = location.state?.orderNumber;
        const amount = location.state?.amount;
        const shippingCost = location.state?.shippingCost;
        const shippingMethod = location.state?.shippingMethod;

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
                    <strong>{ orderNumber }</strong>
                </div>

                <div className="order-confirmation-summary">
                    <div className="order-confirmation-row">
                        <span>Montant de la commande</span>
                        <strong>
                            {amount
                                ? `${Number(amount).toFixed(2).replace(".", ",")} €`
                                : "—"}
                        </strong>
                    </div>

                    <div className="order-confirmation-row">
                        <span>Livraison</span>
                        <strong>
                            {shippingCost !== undefined
                                ? `${Number(shippingCost).toFixed(2).replace(".", ",")} €`
                                : "—"}
                        </strong>
                    </div>

                    <div className="order-confirmation-row">
                        <span>Mode de livraison</span>
                        <strong>
                            {shippingMethod
                                ? `${shippingMethod.name} — ${shippingMethod.deliveryType}`
                                : "—"}
                        </strong>
                    </div>

                    <div className="order-confirmation-row">
                        <span>Total</span>
                        <strong>
                            {amount !== undefined && shippingCost !== undefined
                                ? `${(Number(amount) + Number(shippingCost))
                                    .toFixed(2)
                                    .replace(".", ",")} €`
                                : "—"}
                        </strong>
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