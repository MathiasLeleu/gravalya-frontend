import "./product.css"

import { useRef, useState, useEffect } from "react";

export default function Product() {
    const thumbnailsRef = useRef<HTMLDivElement>(null);

    const [quantity, setQuantity] = useState(1)
    
    const images = [
        "http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg",
        "http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image2.jpg",
        "http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image3.jpg",
        "http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg",
        "http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image3.jpg",
        "http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image2.jpg",
    ];
    const [selectedImage, setSelectedImage] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
        if (!isLightboxOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsLightboxOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isLightboxOpen]);

    const scrollThumbnails = (direction: "left" | "right") => {
        if (!thumbnailsRef.current) return;

        thumbnailsRef.current.scrollBy({
            left: direction === "left" ? -110 : 110,
            behavior: "smooth",
        });
    };

    return (
        <main className="product-page">

            {/* ========================================
                GALERIE
            ======================================== */}

            <section className="product-gallery">

                {/* IMAGE PRINCIPALE */}

                <div className="product-main-image" onClick={() => setIsLightboxOpen(true)}>
                    <img
                        src={images[selectedImage]}
                        alt="Nom du produit"
                    />
                </div>

                {/* MINIATURES */}

                <div className="product-thumbnails-container">

                    <button
                        type="button"
                        className="product-thumbnails-arrow product-thumbnails-arrow-left"
                        onClick={() => scrollThumbnails("left")}
                    >
                        ←
                    </button>

                    <div className="product-thumbnails"  ref={thumbnailsRef}>

                        <div className="product-thumbnails-list">

                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`product-thumbnail ${
                                        selectedImage === index ? "active" : ""
                                    }`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`Nom du produit - vue ${index + 1}`}
                                    />
                                </button>
                            ))}

                        </div>
                        
                    </div>

                    <button
                        type="button"
                        className="product-thumbnails-arrow product-thumbnails-arrow-right"
                        onClick={() => scrollThumbnails("right")}
                    >
                        →
                    </button>

                </div>

            </section>


            {/* ========================================
                INFORMATIONS PRODUIT
            ======================================== */}

            <section className="product-info">

                <h1 className="main-title">
                    Nom du produit
                </h1>

                <p className="product-description">
                    Description du produit. Cette partie contiendra
                    prochainement la description récupérée depuis le
                    backend.
                    Description du produit. Cette partie contiendra
                    prochainement la description récupérée depuis le
                    backend.
                    Description du produit. Cette partie contiendra
                    prochainement la description récupérée depuis le
                    backend.
                    Description du produit. Cette partie contiendra
                    prochainement la description récupérée depuis le
                    backend.
                </p>

                <p className="product-price">
                    24,90 €
                </p>


                {/* QUANTITÉ + AJOUT PANIER */}

                <div className="product-purchase">

                    <div className="product-quantity">

                        <button
                            type="button"
                            className="product-quantity-button"
                            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                        >
                            −
                        </button>

                        <span className="product-quantity-value">
                            {quantity}
                        </span>

                        <button
                            type="button"
                            className="product-quantity-button"
                            onClick={() => setQuantity((current) => current + 1)}
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        className="product-add-button"
                    >
                        Ajouter au panier
                    </button>

                </div>

            </section>

            {isLightboxOpen && (
                <div className="product-lightbox">

                    <button
                        type="button"
                        className="product-lightbox-close"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        ×
                    </button>

                    <button
                        type="button"
                        className="product-lightbox-arrow product-lightbox-arrow-left"
                        onClick={() =>
                            setSelectedImage((current) =>
                                current === 0 ? images.length - 1 : current - 1
                            )
                        }
                    >
                        ←
                    </button>

                    <img
                        className="product-lightbox-image"
                        src={images[selectedImage]}
                        alt={`Nom du produit - vue ${selectedImage + 1}`}
                    />

                    <button
                        type="button"
                        className="product-lightbox-arrow product-lightbox-arrow-right"
                        onClick={() =>
                            setSelectedImage((current) =>
                                current === images.length - 1 ? 0 : current + 1
                            )
                        }
                    >
                        →
                    </button>

                </div>
            )}

        </main>
    );
}