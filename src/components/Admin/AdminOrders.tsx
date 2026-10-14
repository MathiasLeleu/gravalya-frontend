import { useEffect, useRef, useState } from "react";
import { getAllOrders, refreshSendcloudShipment, retrySendcloudShipment, updateOrder } from "../../api";
import "./admin-orders.css";

type OrderStatus =
    | "EN_ATTENTE"
    | "CONFIRMEE"
    | "EXPEDIEE"
    | "LIVREE"
    | "ANNULEE";

type Product = {
    name: string;
};

type OrderLine = {
    id: number;
    quantity: number;
    unitPrice: number | string;
    product?: Product | null;
};

type ShippingMethod = {
    name: string;
    carrier: string;
    deliveryType: string;
};

type OrderRelayPoint = {
    relayPointName: string;
    relayPointAddress: string;
    relayPointPostalCode: string;
    relayPointCity: string;
    relayPointCountry: string;
};

type Order = {
    id: number;
    orderNumber: string;
    statut: OrderStatus;
    amount: number | string;
    shippingCost: number | string;
    sendcloudStatus?: string | null;
    sendcloudShipmentId?: string | null;
    sendcloudParcelId?: string | null;
    sendcloudTrackingNumber?: string | null;
    sendcloudTrackingUrl?: string | null;
    sendcloudLabelUrl?: string | null;
    sendcloudError?: string | null;
    sendcloudCreatedAt?: string | null;
    created_at: string;
    shippingFirstName: string;
    shippingLastName: string;
    shippingCountry: string;
    shippingAddress: string;
    shippingAddress2?: string | null;
    shippingPostalCode: string;
    shippingCity: string;
    shippingPhone: string;
    user?: {
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    orderLines?: OrderLine[];
    shippingMethod?: ShippingMethod | null;
    orderRelayPoint?: OrderRelayPoint | null;
};

const statusLabels: Record<OrderStatus, string> = {
    EN_ATTENTE: "En attente",
    CONFIRMEE: "Confirmée",
    EXPEDIEE: "Expédiée",
    LIVREE: "Livrée",
    ANNULEE: "Annulée",
};

const statusClasses: Record<OrderStatus, string> = {
    EN_ATTENTE: "pending",
    CONFIRMEE: "processing",
    EXPEDIEE: "shipped",
    LIVREE: "completed",
    ANNULEE: "cancelled",
};

const statusOptions: OrderStatus[] = [
    "EN_ATTENTE",
    "CONFIRMEE",
    "EXPEDIEE",
    "LIVREE",
    "ANNULEE",
];

function formatPrice(value: number | string) {
    return `${Number(value).toFixed(2).replace(".", ",")} €`;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR");
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
        null
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saveError, setSaveError] = useState("");

    const [sendcloudAction, setSendcloudAction] = useState<
        "refresh" | "retry" | null
    >(null);

    const [sendcloudError, setSendcloudError] = useState("");
    const [sendcloudMessage, setSendcloudMessage] = useState("");

    const orderDialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        async function loadOrders() {
            try {
                setLoading(true);
                setError("");

                const data = await getAllOrders();

                setOrders(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de récupérer les commandes."
                );
            } finally {
                setLoading(false);
            }
        }

        loadOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const customerName = `${order.shippingFirstName} ${order.shippingLastName}`;

        const matchesSearch =
            order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            customerName.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            order.statut === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openOrderDialog = (order: Order) => {
        setSelectedOrder(order);
        setSelectedStatus(order.statut);
        setSaveError("");

        orderDialogRef.current?.showModal();
    };

    const closeOrderDialog = () => {
        if (saving || sendcloudAction) {
            return;
        }

        orderDialogRef.current?.close();
        setSelectedOrder(null);
        setSelectedStatus(null);
        setSaveError("");
    };

    const handleStatusUpdate = async () => {
        if (!selectedOrder || !selectedStatus) {
            return;
        }

        if (selectedStatus === selectedOrder.statut) {
            return;
        }

        try {
            setSaving(true);
            setSaveError("");

            const updatedOrder = await updateOrder(selectedOrder.id, {
                statut: selectedStatus,
            });

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === selectedOrder.id
                        ? updatedOrder
                        : order
                )
            );

            setSelectedOrder(updatedOrder);
            setSelectedStatus(updatedOrder.statut);
        } catch (error) {
            setSaveError(
                error instanceof Error
                    ? error.message
                    : "Impossible de modifier le statut."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleSendcloudAction = async (
        action: "refresh" | "retry"
    ) => {
        if (!selectedOrder || sendcloudAction) {
            return;
        }

        try {
            setSendcloudAction(action);
            setSendcloudError("");
            setSendcloudMessage("");

            if (action === "refresh") {
                await refreshSendcloudShipment(selectedOrder.id);
            } else {
                await retrySendcloudShipment(selectedOrder.id);
            }

            const updatedOrders = await getAllOrders();

            setOrders(updatedOrders);

            const updatedOrder = updatedOrders.find(
                (order: Order) => order.id === selectedOrder.id
            );

            if (updatedOrder) {
                setSelectedOrder(updatedOrder);
            }

            setSendcloudMessage(
                action === "refresh"
                    ? "Les informations de l'expédition ont été actualisées."
                    : "La demande de relance a été traitée."
            );
        } catch (error) {
            setSendcloudError(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de l'action Sendcloud."
            );
        } finally {
            setSendcloudAction(null);
        }
    };

    return (
        <section className="admin-orders-page">
            <header className="admin-section-header">
                <h1 className="main-title">Commandes</h1>
                <p>Gérez les commandes passées sur Gravelya Studio.</p>
            </header>

            <div className="admin-orders-filters">
                <input
                    type="search"
                    placeholder="Rechercher une commande..."
                    aria-label="Rechercher une commande"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filtrer par statut"
                >
                    <option value="all">Toutes les commandes</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="CONFIRMEE">Confirmées</option>
                    <option value="EXPEDIEE">Expédiées</option>
                    <option value="LIVREE">Livrées</option>
                    <option value="ANNULEE">Annulées</option>
                </select>
            </div>

            {loading && (
                <p className="default-text">
                    Chargement des commandes...
                </p>
            )}

            {!loading && error && (
                <p className="default-text">
                    {error}
                </p>
            )}

            {!loading && !error && filteredOrders.length === 0 && (
                <p className="default-text">
                    Aucune commande ne correspond à votre recherche.
                </p>
            )}

            {!loading && !error && filteredOrders.length > 0 && (
                <div className="admin-orders-list">
                    {filteredOrders.map((order) => {
                        const total =
                            Number(order.amount) +
                            Number(order.shippingCost);

                        const customerName =
                            `${order.shippingFirstName} ${order.shippingLastName}`;

                        return (
                            <article
                                key={order.id}
                                className="admin-order-card"
                            >
                                <div className="admin-order-main">
                                    <strong>
                                        #{order.orderNumber}
                                    </strong>

                                    <div>
                                        <span>{customerName}</span>
                                        <small>
                                            {formatDate(order.created_at)}
                                        </small>
                                    </div>
                                </div>

                                <span className="admin-order-price">
                                    {formatPrice(total)}
                                </span>

                                <span
                                    className={`admin-order-status ${statusClasses[order.statut]}`}
                                >
                                    {statusLabels[order.statut]}
                                </span>

                                <button
                                    type="button"
                                    className="admin-order-button"
                                    onClick={() => openOrderDialog(order)}
                                >
                                    Voir le détail
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}

            <dialog
                ref={orderDialogRef}
                className="admin-order-dialog"
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        closeOrderDialog();
                    }
                }}
            >
                <button
                    type="button"
                    className="admin-order-dialog-close"
                    onClick={closeOrderDialog}
                    aria-label="Fermer le détail de la commande"
                >
                    ×
                </button>

                {selectedOrder && (
                    <article className="admin-order-dialog-content">
                        <header className="admin-order-dialog-header">
                            <h2 className="sub-title">
                                Commande #{selectedOrder.orderNumber}
                            </h2>

                            <p>
                                <strong>Date :</strong>{" "}
                                {formatDate(selectedOrder.created_at)}
                            </p>

                            <p>
                                <strong>Client :</strong>{" "}
                                {selectedOrder.shippingFirstName}{" "}
                                {selectedOrder.shippingLastName}
                            </p>

                            {selectedOrder.user?.email && (
                                <p>
                                    <strong>E-mail :</strong>{" "}
                                    {selectedOrder.user.email}
                                </p>
                            )}
                        </header>

                        <section className="admin-order-dialog-section">
                            <h3 className="low-title">Produits</h3>

                            {selectedOrder.orderLines?.map((line) => (
                                <div
                                    key={line.id}
                                    className="admin-order-dialog-product"
                                >
                                    <span>
                                        {line.product?.name ||
                                            "Produit supprimé"}
                                    </span>

                                    <span>
                                        {line.quantity} ×{" "}
                                        {formatPrice(line.unitPrice)}
                                    </span>
                                </div>
                            ))}
                        </section>

                        <section className="admin-order-dialog-section">
                            <h3 className="low-title">Livraison</h3>

                            <p>
                                <strong>Méthode :</strong>{" "}
                                {selectedOrder.shippingMethod?.name || "—"}
                            </p>

                            {selectedOrder.shippingMethod?.carrier && (
                                <p>
                                    <strong>Transporteur :</strong>{" "}
                                    {selectedOrder.shippingMethod.carrier}
                                </p>
                            )}

                            <address>
                                {selectedOrder.shippingFirstName}{" "}
                                {selectedOrder.shippingLastName}
                                <br />
                                {selectedOrder.shippingAddress}
                                {selectedOrder.shippingAddress2 && (
                                    <>
                                        <br />
                                        {selectedOrder.shippingAddress2}
                                    </>
                                )}
                                <br />
                                {selectedOrder.shippingPostalCode}{" "}
                                {selectedOrder.shippingCity}
                                <br />
                                {selectedOrder.shippingCountry}
                                <br />
                                {selectedOrder.shippingPhone}
                            </address>

                            {selectedOrder.orderRelayPoint && (
                                <>
                                    <h3 className="low-title">
                                        Point relais
                                    </h3>

                                    <address>
                                        <strong>
                                            {
                                                selectedOrder
                                                    .orderRelayPoint
                                                    .relayPointName
                                            }
                                        </strong>
                                        <br />
                                        {
                                            selectedOrder
                                                .orderRelayPoint
                                                .relayPointAddress
                                        }
                                        <br />
                                        {
                                            selectedOrder
                                                .orderRelayPoint
                                                .relayPointPostalCode
                                        }{" "}
                                        {
                                            selectedOrder
                                                .orderRelayPoint
                                                .relayPointCity
                                        }
                                        <br />
                                        {
                                            selectedOrder
                                                .orderRelayPoint
                                                .relayPointCountry
                                        }
                                    </address>
                                </>
                            )}
                        </section>

                        <section className="admin-order-dialog-section admin-order-sendcloud">
                            <h3 className="low-title">Expédition Sendcloud</h3>

                            <p>
                                <strong>Statut :</strong>{" "}
                                {selectedOrder.sendcloudStatus === "CREEE"
                                    ? "Expédition créée"
                                    : selectedOrder.sendcloudStatus === "EN_COURS"
                                    ? "Création en cours"
                                    : selectedOrder.sendcloudStatus === "ERREUR"
                                        ? "Erreur"
                                        : selectedOrder.sendcloudStatus === "DRY_RUN"
                                        ? "Simulation"
                                        : selectedOrder.sendcloudStatus || "Non créée"}
                            </p>

                            {selectedOrder.sendcloudShipmentId && (
                                <p>
                                    <strong>ID expédition :</strong>{" "}
                                    {selectedOrder.sendcloudShipmentId}
                                </p>
                            )}

                            {selectedOrder.sendcloudParcelId && (
                                <p>
                                    <strong>ID colis :</strong>{" "}
                                    {selectedOrder.sendcloudParcelId}
                                </p>
                            )}

                            {selectedOrder.sendcloudTrackingNumber && (
                                <p>
                                    <strong>Numéro de suivi :</strong>{" "}
                                    {selectedOrder.sendcloudTrackingNumber}
                                </p>
                            )}

                            {selectedOrder.sendcloudCreatedAt && (
                                <p>
                                    <strong>Date de création :</strong>{" "}
                                    {formatDate(selectedOrder.sendcloudCreatedAt)}
                                </p>
                            )}

                            {selectedOrder.sendcloudTrackingUrl && (
                                <p>
                                    <a
                                        href={selectedOrder.sendcloudTrackingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Consulter le suivi
                                    </a>
                                </p>
                            )}

                            {selectedOrder.sendcloudLabelUrl && (
                                <p>
                                    <a
                                        href={selectedOrder.sendcloudLabelUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ouvrir l'étiquette d'expédition
                                    </a>
                                </p>
                            )}

                            {selectedOrder.sendcloudError && (
                                <p className="admin-order-sendcloud-error">
                                    <strong>Erreur Sendcloud :</strong>{" "}
                                    {selectedOrder.sendcloudError}
                                </p>
                            )}

                            {sendcloudMessage && (
                                <p className="admin-order-sendcloud-success">
                                    {sendcloudMessage}
                                </p>
                            )}

                            {sendcloudError && (
                                <p className="admin-order-sendcloud-error">
                                    {sendcloudError}
                                </p>
                            )}

                            {selectedOrder.sendcloudShipmentId && (
                                <button
                                    type="button"
                                    className="admin-order-button"
                                    onClick={() => handleSendcloudAction("refresh")}
                                    disabled={sendcloudAction !== null}
                                >
                                    {sendcloudAction === "refresh"
                                        ? "Actualisation..."
                                        : "Actualiser l'expédition"}
                                </button>
                            )}

                            {selectedOrder.statut === "CONFIRMEE" &&
                                !selectedOrder.sendcloudShipmentId &&
                                selectedOrder.sendcloudStatus === "ERREUR" && (
                                    <button
                                        type="button"
                                        className="admin-order-button"
                                        onClick={() => handleSendcloudAction("retry")}
                                        disabled={sendcloudAction !== null}
                                    >
                                        {sendcloudAction === "retry"
                                            ? "Relance en cours..."
                                            : "Relancer l'expédition"}
                                    </button>
                                )}
                        </section>

                        <section className="admin-order-dialog-section">
                            <h3 className="low-title">Récapitulatif</h3>

                            <p>
                                <strong>Sous-total :</strong>{" "}
                                {formatPrice(selectedOrder.amount)}
                            </p>

                            <p>
                                <strong>Livraison :</strong>{" "}
                                {formatPrice(selectedOrder.shippingCost)}
                            </p>

                            <p>
                                <strong>Total :</strong>{" "}
                                {formatPrice(
                                    Number(selectedOrder.amount) +
                                        Number(selectedOrder.shippingCost)
                                )}
                            </p>
                        </section>

                        <section className="admin-order-dialog-section">
                            <h3 className="low-title">Statut</h3>

                            <select
                                value={selectedStatus ?? selectedOrder.statut}
                                onChange={(event) =>
                                    setSelectedStatus(
                                        event.target.value as OrderStatus
                                    )
                                }
                                aria-label="Modifier le statut de la commande"
                            >
                                {statusOptions.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {statusLabels[status]}
                                    </option>
                                ))}
                            </select>

                            {saveError && (
                                <p className="default-text">
                                    {saveError}
                                </p>
                            )}

                            <button
                                type="button"
                                className="admin-order-button"
                                onClick={handleStatusUpdate}
                                disabled={
                                    saving ||
                                    selectedStatus ===
                                        selectedOrder.statut
                                }
                            >
                                {saving
                                    ? "Enregistrement..."
                                    : "Enregistrer le statut"}
                            </button>
                        </section>
                    </article>
                )}
            </dialog>
        </section>
    );
}