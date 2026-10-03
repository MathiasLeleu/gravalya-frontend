import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./profile.css";

import { getMyOrders } from "../../api";
import { useAuthStore } from "../../store";


/* ========================================
   TYPES
======================================== */

type User = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
};

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
    total: number;
    shippingCost: number;
    shippingFirstName: string;
    shippingLastName: string;
    shippingAddress: string;
    shippingAddress2: string | null;
    shippingPostalCode: string;
    shippingCity: string;
    shippingCountry: string;
    shippingPhone: string;
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
   PAGE PROFIL
======================================== */

function Profile() {

    const authUser = useAuthStore((state) => state.user);

    const [user, setUser] = useState<User | null>(authUser);
    const [orders, setOrders] = useState<Order[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

    const orderDialogRef = useRef<HTMLDialogElement>(null);
    const editDialogRef = useRef<HTMLDialogElement>(null);
    const firstNameInputRef = useRef<HTMLInputElement>(null);


    /* ========================================
       CHARGEMENT DES DONNÉES
    ======================================== */

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoading(true);
                setError("");

                if (authUser) {
                    setUser(authUser);
                }

                const ordersData = await getMyOrders();

                const formattedOrders: Order[] = ordersData.map(
                    (order: any) => {

                        const subtotal = Number(order.amount);
                        const shippingCost = Number(order.shippingCost);

                        return {
                            id: order.id,
                            orderNumber: order.orderNumber,
                            date: new Date(
                                order.created_at
                            ).toLocaleDateString("fr-FR"),
                            status: order.statut,
                            total: subtotal + shippingCost,
                            shippingCost,

                            shippingFirstName:
                                order.shippingFirstName,

                            shippingLastName:
                                order.shippingLastName,

                            shippingAddress:
                                order.shippingAddress,

                            shippingAddress2:
                                order.shippingAddress2,

                            shippingPostalCode:
                                order.shippingPostalCode,

                            shippingCity:
                                order.shippingCity,

                            shippingCountry:
                                order.shippingCountry,

                            shippingPhone:
                                order.shippingPhone,

                            items: order.orderLines.map(
                                (line: any) => ({
                                    name: line.product.name,
                                    quantity: line.quantity,
                                    unitPrice:
                                        Number(line.unitPrice),
                                })
                            ),
                        };
                    }
                );

                setOrders(formattedOrders);

            } catch (error) {
                console.error(error);
                setError(
                    "Impossible de récupérer vos informations."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [authUser]);


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
       OUVERTURE MODALE PROFIL
    ======================================== */

    const openEditDialog = () => {

        editDialogRef.current?.showModal();

        firstNameInputRef.current?.focus();
    };


    /* ========================================
       FERMETURE MODALE PROFIL
    ======================================== */

    const closeEditDialog = () => {
        editDialogRef.current?.close();
    };


    /* ========================================
       COMMANDE SÉLECTIONNÉE
    ======================================== */

    const selectedOrderData = orders.find(
        (order) => order.id === selectedOrder
    );


    /* ========================================
       ADRESSE DE LIVRAISON
    ======================================== */

    const latestOrder = orders[0];


    /* ========================================
       CHARGEMENT
    ======================================== */

    if (isLoading) {
        return (
            <main className="profile-page">

                <header className="profile-page-header">

                    <h1 className="main-title">
                        Mon profil
                    </h1>

                    <p className="profile-page-introduction">
                        Chargement de vos informations...
                    </p>

                </header>

            </main>
        );
    }


    /* ========================================
       ERREUR
    ======================================== */

    if (error || !user) {
        return (
            <main className="profile-page">

                <header className="profile-page-header">

                    <h1 className="main-title">
                        Mon profil
                    </h1>

                    <p className="profile-page-introduction">
                        {error || "Impossible de charger votre profil."}
                    </p>

                </header>

            </main>
        );
    }


    return (
        <main className="profile-page">

            {/* ========================================
                HEADER DE PAGE
            ======================================== */}

            <header className="profile-page-header">

                <h1 className="main-title">
                    Mon profil
                </h1>

                <p className="profile-page-introduction">
                    Gérez vos informations personnelles et consultez
                    vos dernières commandes.
                </p>

            </header>


            {/* ========================================
                INFORMATIONS DU PROFIL
            ======================================== */}

            <section className="profile-section">

                <h2 className="sub-title">
                    Mes informations
                </h2>


                {/* INFORMATIONS PERSONNELLES */}

                <div className="profile-info profile-card">

                    <p>
                        <strong>Prénom :</strong>{" "}
                        {user.firstName}
                    </p>

                    <p>
                        <strong>Nom :</strong>{" "}
                        {user.lastName}
                    </p>

                    <p>
                        <strong>Adresse e-mail :</strong>{" "}
                        {user.email}
                    </p>

                </div>


                {/* ADRESSE DE LIVRAISON */}

                <div className="profile-address profile-card">

                    <h3 className="low-title">
                        Adresse de livraison
                    </h3>

                    {latestOrder ? (
                        <>
                            <p>
                                <strong>Prénom :</strong>{" "}
                                {latestOrder.shippingFirstName}
                            </p>

                            <p>
                                <strong>Nom :</strong>{" "}
                                {latestOrder.shippingLastName}
                            </p>

                            <p>
                                <strong>Adresse :</strong>{" "}
                                {latestOrder.shippingAddress}
                            </p>

                            {latestOrder.shippingAddress2 && (
                                <p>
                                    <strong>Complément :</strong>{" "}
                                    {latestOrder.shippingAddress2}
                                </p>
                            )}

                            <p>
                                <strong>Code postal :</strong>{" "}
                                {latestOrder.shippingPostalCode}
                            </p>

                            <p>
                                <strong>Ville :</strong>{" "}
                                {latestOrder.shippingCity}
                            </p>

                            <p>
                                <strong>Pays :</strong>{" "}
                                {latestOrder.shippingCountry}
                            </p>

                        </>
                    ) : (
                        <p>
                            Aucune adresse de livraison disponible.
                        </p>
                    )}

                </div>


                {/* MODIFICATION DU PROFIL */}

                <div className="profile-actions">

                    <button
                        type="button"
                        className="profile-edit-button"
                        onClick={openEditDialog}
                    >
                        Modifier mon profil
                    </button>


                    {/* SUPPRESSION DU COMPTE */}

                    <button
                        type="button"
                        className="profile-delete-button"
                    >
                        Supprimer mon compte
                    </button>

                </div>

            </section>


            {/* ========================================
                MES COMMANDES
            ======================================== */}

            <section className="profile-section">

                <h2 className="sub-title">
                    Mes commandes
                </h2>


                <div className="profile-orders">

                    {orders.slice(0, 4).map((order) => (

                        <article
                            key={order.id}
                            className="profile-order-card profile-card"
                        >

                            <header className="profile-order-header">

                                <h3 className="low-title">
                                    {order.orderNumber}
                                </h3>

                                <span className="profile-order-status">
                                    {order.status}
                                </span>

                            </header>


                            <div className="profile-order-info">

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
                                className="profile-order-button"
                                onClick={() =>
                                    openOrderDialog(order.id)
                                }
                            >
                                Voir le détail
                            </button>

                        </article>

                    ))}

                </div>


                {/* VOIR TOUTES LES COMMANDES */}

                <Link
                    to="/mes-commandes"
                    className="profile-orders-button"
                >
                    Voir toutes mes commandes
                </Link>

            </section>


            {/* ========================================
                MODALE MODIFICATION DU PROFIL
            ======================================== */}

            <dialog
                ref={editDialogRef}
                className="profile-lightbox"
                aria-labelledby="profile-edit-title"
                onClick={(event) => {

                    if (event.target === event.currentTarget) {
                        closeEditDialog();
                    }

                }}
            >

                <button
                    type="button"
                    className="profile-lightbox-close"
                    onClick={closeEditDialog}
                    aria-label="Fermer le formulaire de modification"
                >
                    ×
                </button>


                <form
                    className="profile-modal profile-edit-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                    }}
                >

                    <header className="profile-edit-form-header">

                        <h2
                            id="profile-edit-title"
                            className="sub-title"
                        >
                            Modifier mon profil
                        </h2>

                    </header>


                    {/* INFORMATIONS PERSONNELLES */}

                    <section className="profile-edit-section">

                        <h3 className="low-title">
                            Mes informations
                        </h3>


                        <div className="profile-edit-field">

                            <label htmlFor="profile-first-name">
                                Prénom
                            </label>

                            <input
                                ref={firstNameInputRef}
                                id="profile-first-name"
                                name="firstName"
                                type="text"
                                defaultValue={user.firstName}
                                autoComplete="given-name"
                            />

                        </div>


                        <div className="profile-edit-field">

                            <label htmlFor="profile-last-name">
                                Nom
                            </label>

                            <input
                                id="profile-last-name"
                                name="lastName"
                                type="text"
                                defaultValue={user.lastName}
                                autoComplete="family-name"
                            />

                        </div>


                        <div className="profile-edit-field">

                            <label htmlFor="profile-email">
                                Adresse e-mail
                            </label>

                            <input
                                id="profile-email"
                                name="email"
                                type="email"
                                defaultValue={user.email}
                                autoComplete="email"
                            />

                        </div>

                    </section>


                    {/* ADRESSE DE LIVRAISON */}

                    <section className="profile-edit-section">

                        <h3 className="low-title">
                            Adresse de livraison
                        </h3>

                        <p>
                            Les informations de livraison sont
                            modifiables directement depuis vos commandes.
                        </p>

                    </section>


                    {/* ACTIONS */}

                    <div className="profile-edit-actions">

                        <button
                            type="button"
                            className="profile-edit-cancel"
                            onClick={closeEditDialog}
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="profile-edit-submit"
                        >
                            Enregistrer les modifications
                        </button>

                    </div>

                </form>

            </dialog>


            {/* ========================================
                MODALE DÉTAIL COMMANDE
            ======================================== */}

            <dialog
                ref={orderDialogRef}
                className="profile-lightbox"
                aria-labelledby="profile-order-title"
                onClose={() => setSelectedOrder(null)}
                onClick={(event) => {

                    if (event.target === event.currentTarget) {
                        closeOrderDialog();
                    }

                }}
            >

                <button
                    type="button"
                    className="profile-lightbox-close"
                    onClick={closeOrderDialog}
                    aria-label="Fermer le récapitulatif de la commande"
                >
                    ×
                </button>


                {selectedOrderData && (

                    <article className="profile-modal profile-order-details">

                        <header className="profile-order-details-header">

                            <h2
                                id="profile-order-title"
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


                        {/* PRODUITS */}

                        <section className="profile-order-details-section">

                            <h3 className="low-title">
                                Produits
                            </h3>

                            {selectedOrderData.items.map(
                                (item, index) => (

                                    <div
                                        key={`${item.name}-${index}`}
                                        className="profile-order-product"
                                    >

                                        <p>
                                            {item.name}
                                        </p>

                                        <p>
                                            {item.quantity} ×{" "}
                                            {formatPrice(
                                                item.unitPrice
                                            )}
                                        </p>

                                    </div>

                                )
                            )}

                        </section>


                        {/* RÉCAPITULATIF */}

                        <section className="profile-order-details-section">

                            <h3 className="low-title">
                                Récapitulatif
                            </h3>

                            <p>
                                <strong>Sous-total :</strong>{" "}
                                {formatPrice(
                                    getSubtotal(
                                        selectedOrderData.items
                                    )
                                )}
                            </p>

                            <p>
                                <strong>Livraison :</strong>{" "}
                                {formatPrice(
                                    selectedOrderData.shippingCost
                                )}
                            </p>

                            <p>
                                <strong>Total :</strong>{" "}
                                {formatPrice(
                                    selectedOrderData.total
                                )}
                            </p>

                        </section>


                        {/* ADRESSE */}

                        <section className="profile-order-details-section">

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

                        </section>

                        {/* MODIFICATION DE LA COMMANDE */}

                        {selectedOrderData.status === "EN_ATTENTE" && (

                            <Link
                                to="/mes-commandes"
                                className="profile-orders-button"
                            >
                                Modifier la commande
                            </Link>

                        )}

                    </article>

                )}

            </dialog>

        </main>
    );
}

export default Profile;