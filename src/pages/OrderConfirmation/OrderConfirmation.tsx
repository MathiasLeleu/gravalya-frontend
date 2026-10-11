import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCheckoutStatus } from "../../api";
import "./orderconfirmation.css";

interface OrderConfirmationData {
    orderNumber?: string;
    amount?: number | string;
    shippingCost?: number | string;
    shippingMethod?: {
        name?: string;
        deliveryType?: string;
    } | null;
    relayPoint?: {
        relayPointName?: string;
        relayPointAddress?: string;
        relayPointPostalCode?: string;
        relayPointCity?: string;
        relayPointCountry?: string;
    } | null;
    paymentStatus?: string;
    orderStatus?: string;
}

type ConfirmationState =
    | "loading"
    | "confirmed"
    | "pending"
    | "error";

const formatPrice = (value?: number | string) => {
    if (value === undefined || value === null || value === "") {
        return "—";
    }

    return `${Number(value).toFixed(2).replace(".", ",")} €`;
};

export default function OrderConfirmation() {
    const location = useLocation();

    const sessionId = new URLSearchParams(location.search).get(
        "session_id"
    );

    const previousState =
        location.state as OrderConfirmationData | null;

    const [order, setOrder] = useState<OrderConfirmationData | null>(
        previousState
    );

    const [confirmationState, setConfirmationState] =
        useState<ConfirmationState>(
            sessionId ? "loading" : "error"
        );

    useEffect(() => {
        if (!sessionId) {
            setConfirmationState("error");
            return;
        }

        let active = true;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let attempts = 0;
        const maxAttempts = 15;

        const checkPayment = async () => {
            try {
                const result: OrderConfirmationData =
                    await getCheckoutStatus(sessionId);

                if (!active) return;

                setOrder(result);

                if (
                    result.paymentStatus === "paid" &&
                    result.orderStatus === "CONFIRMEE"
                ) {
                    setConfirmationState("confirmed");
                    return;
                }

                if (attempts >= maxAttempts) {
                    setConfirmationState("pending");
                    return;
                }

                attempts += 1;

                timeoutId = setTimeout(checkPayment, 2000);
            } catch (error) {
                if (!active) return;

                console.error(
                    "Erreur lors de la vérification du paiement :",
                    error
                );

                setConfirmationState("error");
            }
        };

        checkPayment();

        return () => {
            active = false;

            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
        };
    }, [sessionId]);

    const isConfirmed = confirmationState === "confirmed";
    const isPending =
        confirmationState === "pending" ||
        confirmationState === "loading";

    const relayPoint = order?.relayPoint;
    const shippingMethod = order?.shippingMethod;

    return (
        <main className="order-confirmation-page">
            <section className="order-confirmation">
                <div
                    className="order-confirmation-icon"
                    aria-hidden="true"
                >
                    {isConfirmed ? "✓" : isPending ? "…" : "!"}
                </div>

                <header className="order-confirmation-header">
                    <h1 className="main-title">
                        {isConfirmed
                            ? "Merci pour votre commande !"
                            : isPending
                              ? "Vérification de votre paiement"
                              : "Confirmation indisponible"}
                    </h1>

                    {isConfirmed && (
                        <>
                            <p>
                                Votre paiement a été confirmé et votre
                                commande est enregistrée.
                            </p>

                            <p>
                                Un e-mail de confirmation vous sera envoyé
                                prochainement.
                            </p>
                        </>
                    )}

                    {isPending && (
                        <p>
                            {confirmationState === "loading"
                                ? "Nous vérifions votre paiement. Veuillez patienter quelques instants."
                                : "Votre paiement est peut-être reçu, mais la confirmation finale n'est pas encore disponible. Consultez vos commandes dans quelques instants."}
                        </p>
                    )}

                    {confirmationState === "error" && (
                        <p>
                            Nous ne pouvons pas vérifier votre paiement
                            pour le moment. Consultez vos commandes ou
                            contactez-nous avant de tenter un nouveau
                            paiement.
                        </p>
                    )}
                </header>

                {order && (
                    <>
                        {order.orderNumber && (
                            <div className="order-confirmation-number">
                                <span>Numéro de commande</span>
                                <strong>{order.orderNumber}</strong>
                            </div>
                        )}

                        <div className="order-confirmation-summary">
                            <div className="order-confirmation-row">
                                <span>Montant des produits</span>
                                <strong>
                                    {formatPrice(order.amount)}
                                </strong>
                            </div>

                            <div className="order-confirmation-row">
                                <span>Livraison</span>
                                <strong>
                                    {formatPrice(order.shippingCost)}
                                </strong>
                            </div>

                            <div className="order-confirmation-row">
                                <span>Mode de livraison</span>
                                <strong>
                                    {shippingMethod
                                        ? [
                                              shippingMethod.name,
                                              shippingMethod.deliveryType,
                                          ]
                                              .filter(Boolean)
                                              .join(" — ")
                                        : "—"}
                                </strong>
                            </div>

                            {relayPoint && (
                                <div className="order-confirmation-relay-point">
                                    <span>Point relais</span>

                                    <strong className="order-confirmation-relay-name">
                                        {relayPoint.relayPointName}
                                    </strong>

                                    <p>
                                        {relayPoint.relayPointAddress}
                                        <br />
                                        {relayPoint.relayPointPostalCode}{" "}
                                        {relayPoint.relayPointCity}
                                        <br />
                                        {relayPoint.relayPointCountry}
                                    </p>
                                </div>
                            )}

                            <div className="order-confirmation-row">
                                <span>Total</span>
                                <strong>
                                    {order.amount !== undefined &&
                                    order.shippingCost !== undefined
                                        ? formatPrice(
                                              Number(order.amount) +
                                                  Number(order.shippingCost)
                                          )
                                        : "—"}
                                </strong>
                            </div>
                        </div>
                    </>
                )}

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