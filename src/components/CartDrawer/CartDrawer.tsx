import "./CartDrawer.css";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({
    isOpen,
    onClose,
}: CartDrawerProps) {

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

                    <p>
                        Votre panier est vide.
                    </p>

                </div>

            </aside>
        </>
    );
}