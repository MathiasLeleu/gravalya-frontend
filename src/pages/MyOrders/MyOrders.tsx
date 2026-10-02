import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./myorders.css";

import { getMyOrders } from "../../api";


/* ========================================
   TYPES
======================================== */

type OrderItem = {
    name: string;
    quantity: number;
    unitPrice: number;
};

type Order = {
    id: number;
    orderNumber: string;
    date: string;
    status: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    shippingFirstName: string;
    shippingLastName: string;
    shippingAddress: string;
    shippingAddress2: string | null;
    shippingPostalCode: string;
    shippingCity: string;
    shippingCountry: string;
    orderRelayPoint: {
        relayPointName: string;
        relayPointAddress: string;
        relayPointPostalCode: string;
        relayPointCity: string;
        relayPointCountry: string;
    } | null;
    items: OrderItem[];
};

/* ========================================
   FONCTIONS
======================================== */

function formatPrice(price: number) {
    return `${price.toFixed(2).replace(".", ",")} €`;
}


function formatOrderId(id: number) {
    return String(id).padStart(4, "0");
}


function getSubtotal(items: OrderItem[]) {
    return items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
    );
}


/* ========================================
   PAGE MES COMMANDES
======================================== */

export default function MyOrders() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const orderDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await getMyOrders();

                const formattedOrders: Order[] = data.map((order: any) => {
                    const subtotal = Number(order.amount);
                    const shippingCost = Number(order.shippingCost);

                    return {
                        id: order.id,
                        orderNumber: order.orderNumber,
                        date: new Date(order.created_at).toLocaleDateString(
                            "fr-FR"
                        ),
                        status: order.statut,
                        subtotal,
                        shippingCost,
                        total: subtotal + shippingCost,

                        shippingFirstName: order.shippingFirstName,
                        shippingLastName: order.shippingLastName,
                        shippingAddress: order.shippingAddress,
                        shippingAddress2: order.shippingAddress2,
                        shippingPostalCode: order.shippingPostalCode,
                        shippingCity: order.shippingCity,
                        shippingCountry: order.shippingCountry,

                        orderRelayPoint: order.orderRelayPoint
                            ? {
                                relayPointName: order.orderRelayPoint.relayPointName,
                                relayPointAddress: order.orderRelayPoint.relayPointAddress,
                                relayPointPostalCode: order.orderRelayPoint.relayPointPostalCode,
                                relayPointCity: order.orderRelayPoint.relayPointCity,
                                relayPointCountry: order.orderRelayPoint.relayPointCountry,
                            }
                            : null,

                        items: order.orderLines.map((line: any) => ({
                            name: line.product.name,
                            quantity: line.quantity,
                            unitPrice: Number(line.unitPrice),
                        })),
                    };
                });

                setOrders(formattedOrders);
            } catch (error) {
                console.error(error);
                setError("Impossible de récupérer vos commandes.");
            } finally {
                setIsLoading(false);
            }
        };

        loadOrders();
    }, []);


    /* ========================================
       OUVERTURE MODALE COMMANDE
    ======================================== */

    const openOrderDialog = (orderId: number) => {

        setSelectedOrder(orderId);

        orderDialogRef.current?.showModal();
    };


    /* ========================================
       FERMETURE MODALE COMMANDE
    ======================================== */

    const closeOrderDialog = () => {

        orderDialogRef.current?.close();
    };


    /* ========================================
       COMMANDE SÉLECTIONNÉE
    ======================================== */

    const selectedOrderData = orders.find(
        (order) => order.id === selectedOrder
    );


    return (
        <main className="myorders-page">

            {/* ========================================
                HEADER
            ======================================== */}

            <header className="myorders-page-header">

                <h1 className="main-title">
                    Mes commandes
                </h1>

                <p className="myorders-page-introduction">
                    Consultez l'historique de vos commandes.
                </p>

            </header>


            {/* ========================================
                COMMANDES
            ======================================== */}

            <section className="myorders-section">

                <div className="myorders">

                    {orders.map((order) => (

                        <article
                            key={order.id}
                            className="myorders-card"
                        >

                            <header className="myorders-card-header">

                                <h2 className="low-title">
                                    {order.orderNumber}
                                </h2>

                                <span className="myorders-status">
                                    {order.status}
                                </span>

                            </header>


                            <div className="myorders-info">

                                <p>
                                    <strong>Date :</strong>{" "}
                                    {order.date}
                                </p>

                                <p>
                                    <strong>Total :</strong>{" "}
                                    {formatPrice(order.total)}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="myorders-detail-button"
                                onClick={() => openOrderDialog(order.id)}
                            >
                                Voir le détail
                            </button>

                        </article>

                    ))}

                </div>

            </section>


            {/* ========================================
                RETOUR PROFIL
            ======================================== */}

            <Link
                to="/profil"
                className="myorders-back-button"
            >
                Retour à mon profil
            </Link>


            {/* ========================================
                MODALE DÉTAIL COMMANDE
            ======================================== */}

            <dialog
                ref={orderDialogRef}
                className="myorders-lightbox"
                aria-labelledby="myorders-order-title"
                onClose={() => setSelectedOrder(null)}
                onClick={(event) => {

                    if (event.target === event.currentTarget) {
                        closeOrderDialog();
                    }

                }}
            >

                <button
                    type="button"
                    className="myorders-lightbox-close"
                    onClick={closeOrderDialog}
                    aria-label="Fermer le récapitulatif de la commande"
                >
                    ×
                </button>


                {selectedOrderData && (

                    <article className="myorders-modal">

                        {/* ========================================
                            HEADER COMMANDE
                        ======================================== */}

                        <header className="myorders-order-details-header">

                            <h2
                                id="myorders-order-title"
                                className="sub-title"
                            >
                                {selectedOrderData.orderNumber}
                            </h2>

                            <p>
                                <strong>Date :</strong>{" "}
                                {selectedOrderData.date}
                            </p>

                            <p>
                                <strong>Statut :</strong>{" "}
                                {selectedOrderData.status}
                            </p>

                        </header>


                        {/* ========================================
                            PRODUITS
                        ======================================== */}

                        <section className="myorders-order-details-section">

                            <h3 className="low-title">
                                Produits
                            </h3>


                            {selectedOrderData.items.map((item, index) => (

                                <div
                                    key={`${item.name}-${index}`}
                                    className="myorders-order-product"
                                >

                                    <p>
                                        {item.name}
                                    </p>

                                    <p>
                                        {item.quantity} ×{" "}
                                        {formatPrice(item.unitPrice)}
                                    </p>

                                </div>

                            ))}

                        </section>


                        {/* ========================================
                            RÉCAPITULATIF
                        ======================================== */}

                        <section className="myorders-order-details-section">

                            <h3 className="low-title">
                                Récapitulatif
                            </h3>

                            <p>
                                <strong>Sous-total :</strong>{" "}
                                {formatPrice(
                                    getSubtotal(selectedOrderData.items)
                                )}
                            </p>

                            <p>
                                <strong>Livraison :</strong>{" "}
                                {formatPrice(selectedOrderData.shippingCost)}
                            </p>

                            <p>
                                <strong>Total :</strong>{" "}
                                {formatPrice(selectedOrderData.total)}
                            </p>

                        </section>


                        {/* ========================================
                            ADRESSE
                        ======================================== */}

                        <section className="myorders-order-details-section">

                            <h3 className="low-title">
                                Adresse de livraison
                            </h3>

                            <address>
                                {selectedOrderData.shippingFirstName}{" "}
                                {selectedOrderData.shippingLastName}
                                <br />

                                {selectedOrderData.shippingAddress}

                                {selectedOrderData.shippingAddress2 && (
                                    <>
                                        <br />
                                        {selectedOrderData.shippingAddress2}
                                    </>
                                )}

                                <br />

                                {selectedOrderData.shippingPostalCode}{" "}
                                {selectedOrderData.shippingCity}
                                <br />

                                {selectedOrderData.shippingCountry}
                            </address>

                            {selectedOrderData.orderRelayPoint && (
                                <div className="myorders-order-relay-point">

                                    <h3 className="low-title">
                                        Point relais
                                    </h3>

                                    <address>
                                        <strong>
                                            {selectedOrderData.orderRelayPoint.relayPointName}
                                        </strong>
                                        <br />

                                        {selectedOrderData.orderRelayPoint.relayPointAddress}
                                        <br />

                                        {selectedOrderData.orderRelayPoint.relayPointPostalCode}{" "}
                                        {selectedOrderData.orderRelayPoint.relayPointCity}
                                        <br />

                                        {selectedOrderData.orderRelayPoint.relayPointCountry}
                                    </address>

                                </div>
                            )}

                        </section>

                    </article>

                )}

            </dialog>

        </main>
    );
}