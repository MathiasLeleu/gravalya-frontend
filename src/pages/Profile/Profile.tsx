import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./profile.css";


/* ========================================
   TYPES
======================================== */

type User = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    addressComplement: string;
    postalCode: string;
    city: string;
    country: string;
};

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

const user: User = {
    firstName: "Mathias",
    lastName: "Leleu",
    email: "exemple@email.fr",
    address: "12 rue Exemple",
    addressComplement: "Appartement 2",
    postalCode: "29000",
    city: "Quimper",
    country: "France"
};


const orders: Order[] = [
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


function Profile() {

    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

    const orderDialogRef = useRef<HTMLDialogElement>(null);
    const editDialogRef = useRef<HTMLDialogElement>(null);
    const firstNameInputRef = useRef<HTMLInputElement>(null);


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
                        <strong>Prénom :</strong> {user.firstName}
                    </p>

                    <p>
                        <strong>Nom :</strong> {user.lastName}
                    </p>

                    <p>
                        <strong>Adresse e-mail :</strong> {user.email}
                    </p>

                </div>


                {/* ADRESSE DE LIVRAISON */}

                <div className="profile-address profile-card">

                    <h3 className="low-title">
                        Adresse de livraison
                    </h3>

                    <p>
                        <strong>Prénom :</strong> {user.firstName}
                    </p>

                    <p>
                        <strong>Nom :</strong> {user.lastName}
                    </p>

                    <p>
                        <strong>Adresse :</strong> {user.address}
                    </p>

                    <p>
                        <strong>Complément :</strong>{" "}
                        {user.addressComplement}
                    </p>

                    <p>
                        <strong>Code postal :</strong> {user.postalCode}
                    </p>

                    <p>
                        <strong>Ville :</strong> {user.city}
                    </p>

                    <p>
                        <strong>Pays :</strong> {user.country}
                    </p>

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

                    {orders.map((order) => (

                        <article
                            key={order.id}
                            className="profile-order-card profile-card"
                        >

                            <header className="profile-order-header">

                                <h3 className="low-title">
                                    Commande #{formatOrderId(order.id)}
                                </h3>

                                <span className="profile-order-status">
                                    {order.status}
                                </span>

                            </header>


                            <div className="profile-order-info">

                                <p>
                                    <strong>Date :</strong> {order.date}
                                </p>

                                <p>
                                    <strong>Total :</strong>{" "}
                                    {formatPrice(order.total)}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="profile-order-button"
                                onClick={() => openOrderDialog(order.id)}
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


                        <div className="profile-edit-field">

                            <label htmlFor="profile-address">
                                Adresse
                            </label>

                            <input
                                id="profile-address"
                                name="address"
                                type="text"
                                defaultValue={user.address}
                                autoComplete="address-line1"
                            />

                        </div>


                        <div className="profile-edit-field">

                            <label htmlFor="profile-address-complement">
                                Complément
                            </label>

                            <input
                                id="profile-address-complement"
                                name="addressComplement"
                                type="text"
                                defaultValue={user.addressComplement}
                                autoComplete="address-line2"
                            />

                        </div>


                        <div className="profile-edit-field">

                            <label htmlFor="profile-postal-code">
                                Code postal
                            </label>

                            <input
                                id="profile-postal-code"
                                name="postalCode"
                                type="text"
                                defaultValue={user.postalCode}
                                autoComplete="postal-code"
                            />

                        </div>


                        <div className="profile-edit-field">

                            <label htmlFor="profile-city">
                                Ville
                            </label>

                            <input
                                id="profile-city"
                                name="city"
                                type="text"
                                defaultValue={user.city}
                                autoComplete="address-level2"
                            />

                        </div>


                        <div className="profile-edit-field">

                            <label htmlFor="profile-country">
                                Pays
                            </label>

                            <input
                                id="profile-country"
                                name="country"
                                type="text"
                                defaultValue={user.country}
                                autoComplete="country-name"
                            />

                        </div>

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


                        {/* PRODUITS */}

                        <section className="profile-order-details-section">

                            <h3 className="low-title">
                                Produits
                            </h3>

                            {selectedOrderData.items.map((item, index) => (

                                <div
                                    key={`${item.name}-${index}`}
                                    className="profile-order-product"
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


                        {/* RÉCAPITULATIF */}

                        <section className="profile-order-details-section">

                            <h3 className="low-title">
                                Récapitulatif
                            </h3>

                            <p>
                                <strong>Sous-total :</strong>{" "}
                                {formatPrice(getSubtotal(selectedOrderData.items))}
                            </p>

                            <p>
                                <strong>Livraison :</strong> 0,00 €
                            </p>

                            <p>
                                <strong>Total :</strong>{" "}
                                {formatPrice(selectedOrderData.total)}
                            </p>

                        </section>


                        {/* ADRESSE */}

                        <section className="profile-order-details-section">

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

export default Profile;