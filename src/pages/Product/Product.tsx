import "./product.css"

import { useRef } from "react";

export default function Product() {
    const thumbnailsRef = useRef<HTMLDivElement>(null);

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

                <div className="product-main-image">
                    <img
                        src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg"
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

                        <button
                            type="button"
                            className="product-thumbnail active"
                        >
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image2.jpg"
                                alt="Nom du produit - vue principale"
                            />
                        </button>

                        <button
                            type="button"
                            className="product-thumbnail"
                        >
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg"
                                alt="Nom du produit - vue 2"
                            />
                        </button>

                        <button
                            type="button"
                            className="product-thumbnail"
                        >
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg"
                                alt="Nom du produit - vue 3"
                            />
                        </button>

                        <button
                            type="button"
                            className="product-thumbnail"
                        >
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg"
                                alt="Nom du produit - vue 4"
                            />
                        </button>

                        <button
                            type="button"
                            className="product-thumbnail"
                        >
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg"
                                alt="Nom du produit - vue 5"
                            />
                        </button>

                        <button
                            type="button"
                            className="product-thumbnail"
                        >
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image2.jpg"
                                alt="Nom du produit - vue 6"
                            />
                        </button>

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
                        >
                            −
                        </button>

                        <span className="product-quantity-value">
                            1
                        </span>

                        <button
                            type="button"
                            className="product-quantity-button"
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

        </main>
    );
}