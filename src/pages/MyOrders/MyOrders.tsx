import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./myorders.css";

import { getMyOrders, updateOrder, cancelOrder, getRelayPoints } from "../../api";
import type { IRelayPoint } from "../../@types/index.ts";


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
    shippingMethodId: number;
    shippingFirstName: string;
    shippingLastName: string;
    shippingAddress: string;
    shippingAddress2: string | null;
    shippingPostalCode: string;
    shippingCity: string;
    shippingCountry: string;
    shippingPhone: string;
    orderRelayPoint: {
        relayPointId: number;
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

    const [isEditingDelivery, setIsEditingDelivery] = useState(false);
    const [deliveryForm, setDeliveryForm] = useState({
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        phone: "",
    });

    const [isSavingDelivery, setIsSavingDelivery] = useState(false);

    const [relayPoints, setRelayPoints] = useState<IRelayPoint[]>([]);
    const [selectedRelayPoint, setSelectedRelayPoint] = useState<IRelayPoint | null>(null);
    const [isRelayLoading, setIsRelayLoading] = useState(false);
    const [relayError, setRelayError] = useState("");

    const [deliveryErrors, setDeliveryErrors] = useState({
        firstName: "",
        lastName: "",
        address: "",
        postalCode: "",
        city: "",
        phone: "",
    });

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
                        shippingMethodId: order.shippingMethodId,

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

    const handleCancelOrder = async (orderId: number) => {
        try {
            await cancelOrder(orderId);

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
                    shippingMethodId: order.shippingMethodId,
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
            setSelectedOrder(null);
        } catch (error) {
            console.error(error);
        }
    };


    /* ========================================
       OUVERTURE MODALE COMMANDE
    ======================================== */

    const handleDeliveryChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setDeliveryForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSearchRelayPoints = async () => {
        if (
            !deliveryForm.postalCode.trim() ||
            !deliveryForm.city.trim()
        ) {
            setRelayError(
                "Veuillez renseigner votre code postal et votre ville."
            );
            return;
        }

        setIsRelayLoading(true);
        setRelayError("");
        setSelectedRelayPoint(null);

        try {
            if (!selectedOrderData) {
            setRelayError("Commande introuvable.");
            return;
        }

        const points = await getRelayPoints(
            selectedOrderData.shippingMethodId,
            deliveryForm.postalCode,
            deliveryForm.city
        );

            setRelayPoints(points);

            if (points.length === 0) {
                setRelayError(
                    "Aucun point relais disponible pour cette adresse."
                );
            }
        } catch (error) {
            console.error(error);
            setRelayPoints([]);
            setRelayError(
                "Impossible de récupérer les points relais."
            );
        } finally {
            setIsRelayLoading(false);
        }
    };

    const handleUpdateDelivery = async () => {
        if (!selectedOrderData) {
            return;
        }

        const errors = {
            firstName: "",
            lastName: "",
            address: "",
            postalCode: "",
            city: "",
            phone: "",
        };

        if (!deliveryForm.firstName.trim()) {
            errors.firstName = "Le prénom est requis.";
        }

        if (!deliveryForm.lastName.trim()) {
            errors.lastName = "Le nom est requis.";
        }

        if (!deliveryForm.address.trim()) {
            errors.address = "L'adresse est requise.";
        }

        if (!deliveryForm.city.trim()) {
            errors.city = "La ville est requise.";
        }

        setDeliveryErrors(errors);

        if (Object.values(errors).some((error) => error !== "")) {
            return;
        }

        try {
            setIsSavingDelivery(true);

            const updatedOrder = await updateOrder(
                selectedOrderData.id,
                {
                    shippingFirstName: deliveryForm.firstName,
                    shippingLastName: deliveryForm.lastName,
                    shippingAddress: deliveryForm.address,
                    shippingAddress2: deliveryForm.address2 || null,
                    shippingPostalCode: deliveryForm.postalCode,
                    shippingCity: deliveryForm.city,
                    shippingPhone: deliveryForm.phone,
                    ...(selectedRelayPoint
                        ? {
                            relayPoint: {
                                relayPointId: selectedRelayPoint.relayPointId,
                                relayPointName: selectedRelayPoint.relayPointName,
                                relayPointAddress: selectedRelayPoint.relayPointAddress,
                                relayPointPostalCode: selectedRelayPoint.relayPointPostalCode,
                                relayPointCity: selectedRelayPoint.relayPointCity,
                                relayPointCountry: "France",
                            },
                        }
                        : {}),
                }
            );

            setOrders((current) =>
                current.map((order) =>
                    order.id === updatedOrder.id
                        ? {
                            ...order,
                            shippingFirstName: updatedOrder.shippingFirstName,
                            shippingLastName: updatedOrder.shippingLastName,
                            shippingAddress: updatedOrder.shippingAddress,
                            shippingAddress2: updatedOrder.shippingAddress2,
                            shippingPostalCode: updatedOrder.shippingPostalCode,
                            shippingCity: updatedOrder.shippingCity,
                            shippingPhone: updatedOrder.shippingPhone,

                            orderRelayPoint: updatedOrder.orderRelayPoint
                                ? {
                                    relayPointId:
                                        updatedOrder.orderRelayPoint.relayPointId,
                                    relayPointName:
                                        updatedOrder.orderRelayPoint.relayPointName,
                                    relayPointAddress:
                                        updatedOrder.orderRelayPoint.relayPointAddress,
                                    relayPointPostalCode:
                                        updatedOrder.orderRelayPoint.relayPointPostalCode,
                                    relayPointCity:
                                        updatedOrder.orderRelayPoint.relayPointCity,
                                    relayPointCountry:
                                        updatedOrder.orderRelayPoint.relayPointCountry,
                                }
                                : null,
                        }
                        : order
                )
            );

            setSelectedRelayPoint(null);
            setRelayPoints([]);
            setRelayError("");

            setIsEditingDelivery(false);

        } catch (error) {
            console.error(error);

            const typedError = error as Error & {
                details?: {
                    message: string;
                    path: string;
                }[];
            };

            const backendErrors = {
                firstName: "",
                lastName: "",
                address: "",
                postalCode: "",
                city: "",
                phone: "",
            };

            typedError.details?.forEach((detail) => {
                switch (detail.path) {
                    case "shippingFirstName":
                        backendErrors.firstName = detail.message;
                        break;

                    case "shippingLastName":
                        backendErrors.lastName = detail.message;
                        break;

                    case "shippingAddress":
                        backendErrors.address = detail.message;
                        break;

                    case "shippingPostalCode":
                        backendErrors.postalCode = detail.message;
                        break;

                    case "shippingCity":
                        backendErrors.city = detail.message;
                        break;

                    case "shippingPhone":
                        backendErrors.phone = detail.message;
                        break;
                }
            });

            setDeliveryErrors(backendErrors);

        } finally {
            setIsSavingDelivery(false);
        }
    };

    const openOrderDialog = (orderId: number) => {

        setSelectedOrder(orderId);

        orderDialogRef.current?.showModal();
    };


    /* ========================================
       FERMETURE MODALE COMMANDE
    ======================================== */

    const closeOrderDialog = () => {
        setIsEditingDelivery(false);
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


                            <div className="myorders-card-actions">

                                <button
                                    type="button"
                                    className="myorders-detail-button"
                                    onClick={() => openOrderDialog(order.id)}
                                >
                                    Voir le détail
                                </button>

                                {order.status === "EN_ATTENTE" && (
                                    <button
                                        type="button"
                                        className="myorders-cancel-button"
                                        onClick={() => handleCancelOrder(order.id)}
                                    >
                                        Annuler la commande
                                    </button>
                                )}

                            </div>

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
                onClose={() => {
                    setSelectedOrder(null);
                    setIsEditingDelivery(false);
                }}
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

                            {isEditingDelivery ? (
                                <div className="myorders-delivery-form">

                                    <div className="myorders-form-field">
                                        <label htmlFor="delivery-first-name">
                                            Prénom
                                        </label>

                                        <input
                                            id="delivery-first-name"
                                            type="text"
                                            name="firstName"
                                            value={deliveryForm.firstName}
                                            onChange={handleDeliveryChange}
                                        />

                                        {deliveryErrors.firstName && (
                                            <p className="myorders-form-error">
                                                {deliveryErrors.firstName}
                                            </p>
                                        )}

                                    </div>


                                    <div className="myorders-form-field">
                                        <label htmlFor="delivery-last-name">
                                            Nom
                                        </label>

                                        <input
                                            id="delivery-last-name"
                                            type="text"
                                            name="lastName"
                                            value={deliveryForm.lastName}
                                            onChange={handleDeliveryChange}
                                        />
                                        
                                        {deliveryErrors.lastName && (
                                            <p className="myorders-form-error">
                                                {deliveryErrors.lastName}
                                            </p>
                                        )}

                                    </div>


                                    <div className="myorders-form-field">
                                        <label htmlFor="delivery-address">
                                            Adresse
                                        </label>

                                        <input
                                            id="delivery-address"
                                            type="text"
                                            name="address"
                                            value={deliveryForm.address}
                                            onChange={handleDeliveryChange}
                                        />
                                        
                                        {deliveryErrors.address && (
                                            <p className="myorders-form-error">
                                                {deliveryErrors.address}
                                            </p>
                                        )}

                                    </div>


                                    <div className="myorders-form-field">
                                        <label htmlFor="delivery-address2">
                                            Complément d'adresse
                                        </label>

                                        <input
                                            id="delivery-address2"
                                            type="text"
                                            name="address2"
                                            value={deliveryForm.address2}
                                            onChange={handleDeliveryChange}
                                        />

                                    </div>


                                    <div className="myorders-form-row">

                                        <div className="myorders-form-field">
                                            <label htmlFor="delivery-postal-code">
                                                Code postal
                                            </label>

                                            <input
                                                id="delivery-postal-code"
                                                type="text"
                                                name="postalCode"
                                                value={deliveryForm.postalCode}
                                                onChange={handleDeliveryChange}
                                            />

                                            {deliveryErrors.postalCode && (
                                                <p className="myorders-form-error">
                                                    {deliveryErrors.postalCode}
                                                </p>
                                            )}

                                        </div>


                                        <div className="myorders-form-field">
                                            <label htmlFor="delivery-city">
                                                Ville
                                            </label>

                                            <input
                                                id="delivery-city"
                                                type="text"
                                                name="city"
                                                value={deliveryForm.city}
                                                onChange={handleDeliveryChange}
                                            />

                                            {deliveryErrors.city && (
                                                <p className="myorders-form-error">
                                                    {deliveryErrors.city}
                                                </p>
                                            )}

                                        </div>

                                    </div>


                                    <div className="myorders-form-field">
                                        <label htmlFor="delivery-phone">
                                            Téléphone
                                        </label>

                                        <input
                                            id="delivery-phone"
                                            type="tel"
                                            name="phone"
                                            value={deliveryForm.phone}
                                            onChange={handleDeliveryChange}
                                        />

                                        {deliveryErrors.phone && (
                                            <p className="myorders-form-error">
                                                {deliveryErrors.phone}
                                            </p>
                                        )}

                                    </div>

                                    {selectedOrderData.orderRelayPoint && (
                                        <div className="myorders-relay-edit">

                                            <h4 className="low-title">
                                                Point relais
                                            </h4>

                                            <p>
                                                Recherchez un nouveau point relais si vous modifiez
                                                votre adresse, votre code postal ou votre ville.
                                            </p>

                                            <button
                                                type="button"
                                                className="myorders-search-relay-button"
                                                onClick={handleSearchRelayPoints}
                                                disabled={isRelayLoading}
                                            >
                                                {isRelayLoading
                                                    ? "Recherche..."
                                                    : "Rechercher un point relais"}
                                            </button>

                                            {relayError && (
                                                <p className="myorders-form-error">
                                                    {relayError}
                                                </p>
                                            )}

                                            {relayPoints.length > 0 && (
                                                <div className="myorders-relay-list">

                                                    {relayPoints.map((relayPoint) => (

                                                        <button
                                                            type="button"
                                                            key={relayPoint.relayPointId}
                                                            className={
                                                                selectedRelayPoint?.relayPointId ===
                                                                relayPoint.relayPointId
                                                                    ? "myorders-relay-option selected"
                                                                    : "myorders-relay-option"
                                                            }
                                                            onClick={() =>
                                                                setSelectedRelayPoint(relayPoint)
                                                            }
                                                        >
                                                            <strong>
                                                                {relayPoint.relayPointName}
                                                            </strong>

                                                            <span>
                                                                {relayPoint.relayPointAddress}
                                                            </span>

                                                            <span>
                                                                {relayPoint.relayPointPostalCode}{" "}
                                                                {relayPoint.relayPointCity}
                                                            </span>

                                                        </button>

                                                    ))}

                                                </div>
                                            )}

                                        </div>
                                    )}


                                    <div className="myorders-form-actions">

                                        <button
                                            type="button"
                                            className="myorders-save-delivery-button"
                                            onClick={handleUpdateDelivery}
                                            disabled={isSavingDelivery}
                                        >
                                            {isSavingDelivery
                                                ? "Enregistrement..."
                                                : "Enregistrer"}
                                        </button>

                                        <button
                                            type="button"
                                            className="myorders-cancel-edit-button"
                                            onClick={() => {
                                                setDeliveryErrors({
                                                    firstName: "",
                                                    lastName: "",
                                                    address: "",
                                                    postalCode: "",
                                                    city: "",
                                                    phone: "",
                                                });

                                                setIsEditingDelivery(false);
                                            }}
                                        >
                                            Annuler
                                        </button>

                                    </div>

                                </div>
                            ) : (
                                <>
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

                                    {selectedOrderData.status === "EN_ATTENTE" && (
                                        <button
                                            type="button"
                                            className="myorders-edit-delivery-button"
                                            onClick={() => {
                                                setDeliveryErrors({
                                                    firstName: "",
                                                    lastName: "",
                                                    address: "",
                                                    postalCode: "",
                                                    city: "",
                                                    phone: "",
                                                });
                                                setDeliveryForm({
                                                    firstName: selectedOrderData.shippingFirstName,
                                                    lastName: selectedOrderData.shippingLastName,
                                                    address: selectedOrderData.shippingAddress,
                                                    address2: selectedOrderData.shippingAddress2 || "",
                                                    postalCode: selectedOrderData.shippingPostalCode,
                                                    city: selectedOrderData.shippingCity,
                                                    phone: selectedOrderData.shippingPhone,
                                                });

                                                setSelectedRelayPoint(null);
                                                setRelayPoints([]);
                                                setRelayError("");

                                                setIsEditingDelivery(true);
                                            }}
                                        >
                                            Modifier les informations de livraison
                                        </button>
                                    )}
                                </>
                            )}

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