import "./CartDrawer.css";

import { useAuthStore } from "../../store";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({
    isOpen,
    onClose,
}: CartDrawerProps) {

    const navigate = useNavigate();

    const cart = useAuthStore((state) => state.cart);
    const removeFromCart = useAuthStore((state) => state.removeFromCart);
    const updateCartQuantity = useAuthStore(
        (state) => state.updateCartQuantity
    );

    const cartTotal = cart.reduce(
        (total, item) =>
            total + Number(item.product.price) * item.quantity,
        0
    );

    if (!isOpen) return null;

    return (
        <>
            <div
                className="cart-drawer-overlay"
                onClick={onClose}
            />

            <aside className="cart-drawer">

                <div className="cart-drawer-header">

                    <h2 className="sub-title">
                        Votre panier
                    </h2>

                    <button
                        type="button"
                        className="cart-drawer-close"
                        onClick={onClose}
                        aria-label="Fermer le panier"
                    >
                        ×
                    </button>

                </div>


                <div className="cart-drawer-content">

                    {cart.length === 0 ? (
                        <p>
                            Votre panier est vide.
                        </p>
                    ) : (
                        <div className="cart-items">

                            {cart.map((item) => {

                                const mainImage = item.product.pictures.find(
                                    (picture) => picture.isMain
                                );

                                return (
                                    <article
                                        key={item.product.id}
                                        className="cart-item"
                                    >

                                        {mainImage && (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${mainImage.url}`}
                                                alt={mainImage.alt}
                                                className="cart-item-image"
                                            />
                                        )}

                                        <div className="cart-item-info">

                                            <h3>
                                                {item.product.name}
                                            </h3>

                                            <p>
                                                {Number(item.product.price)
                                                    .toFixed(2)
                                                    .replace(".", ",")} €
                                            </p>

                                            <div className="cart-item-actions">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.product.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.product.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                        item.product.stockQuantity
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFromCart(item.product.id)
                                                }
                                            >
                                                Supprimer
                                            </button>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>
                    )}

                    {cart.length > 0 && (
                        <div className="cart-total">

                            <p>
                                Total
                            </p>

                            <p>
                                {cartTotal.toFixed(2).replace(".", ",")} €
                            </p>

                        </div>
                    )}

                    {cart.length > 0 && (
                        <button
                            type="button"
                            className="cart-checkout-button"
                            onClick={() => {
                                onClose();
                                navigate("/commande");
                            }}
                        >
                            Passer la commande
                        </button>
                    )}

                </div>

            </aside>
        </>
    );
}