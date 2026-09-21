import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./myorders.css";


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
    date: string;
    status: string;
    total: number;
    items: OrderItem[];
};


/* ========================================
   DONNÉES TEMPORAIRES
======================================== */

const orders: Order[] = [
    {
        id: 7,
        date: "21 septembre 2026",
        status: "En préparation",
        total: 42.80,
        items: [
            {
                name: "Plaque de porte personnalisée",
                quantity: 1,
                unitPrice: 19.90
            },
            {
                name: "Porte-clés personnalisé",
                quantity: 2,
                unitPrice: 8.90
            },
            {
                name: "Badge personnalisé",
                quantity: 1,
                unitPrice: 5.10
            }
        ]
    },
    {
        id: 6,
        date: "20 septembre 2026",
        status: "En attente de paiement",
        total: 68.70,
        items: [
            {
                name: "Décoration murale personnalisée",
                quantity: 1,
                unitPrice: 34.90
            },
            {
                name: "Plaque de porte",
                quantity: 2,
                unitPrice: 16.90
            }
        ]
    },
    {
        id: 5,
        date: "19 septembre 2026",
        status: "Expédiée",
        total: 51.70,
        items: [
            {
                name: "Porte-clés personnalisé",
                quantity: 3,
                unitPrice: 8.90
            },
            {
                name: "Badge personnalisé",
                quantity: 2,
                unitPrice: 12.50
            }
        ]
    },
    {
        id: 4,
        date: "16 septembre 2026",
        status: "Livrée",
        total: 89.80,
        items: [
            {
                name: "Plaque de porte personnalisée",
                quantity: 2,
                unitPrice: 19.90
            },
            {
                name: "Décoration murale personnalisée",
                quantity: 1,
                unitPrice: 34.90
            },
            {
                name: "Porte-clés personnalisé",
                quantity: 1,
                unitPrice: 15.10
            }
        ]
    },
    {
        id: 3,
        date: "14 septembre 2026",
        status: "Annulée",
        total: 29.80,
        items: [
            {
                name: "Porte-clés personnalisé",
                quantity: 2,
                unitPrice: 8.90
            },
            {
                name: "Badge personnalisé",
                quantity: 1,
                unitPrice: 12.00
            }
        ]
    },
    {
        id: 2,
        date: "18 septembre 2026",
        status: "Livrée",
        total: 34.90,
        items: [
            {
                name: "Porte-clés personnalisé",
                quantity: 2,
                unitPrice: 8.90
            },
            {
                name: "Plaque de porte",
                quantity: 1,
                unitPrice: 17.10
            }
        ]
    },
    {
        id: 1,
        date: "12 septembre 2026",
        status: "Expédiée",
        total: 24.90,
        items: [
            {
                name: "Porte-clés personnalisé",
                quantity: 1,
                unitPrice: 8.90
            },
            {
                name: "Plaque de porte",
                quantity: 1,
                unitPrice: 16.00
            }
        ]
    }
];


/* ========================================
   DONNÉES TEMPORAIRES UTILISATEUR
======================================== */

const user = {
    firstName: "Mathias",
    lastName: "Leleu",
    address: "12 rue Exemple",
    postalCode: "29000",
    city: "Quimper",
    country: "France"
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

    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

    const orderDialogRef = useRef<HTMLDialogElement>(null);


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
                                    Commande #{formatOrderId(order.id)}
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
                                Commande #{formatOrderId(selectedOrderData.id)}
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
                                <strong>Livraison :</strong> 0,00 €
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

                                {user.firstName} {user.lastName}
                                <br />

                                {user.address}
                                <br />

                                {user.postalCode} {user.city}
                                <br />

                                {user.country}

                            </address>

                        </section>

                    </article>

                )}

            </dialog>

        </main>
    );
}