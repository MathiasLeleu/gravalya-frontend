import "./product.css"

import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import type { IProduct } from "../../@types";
import { getProductById } from "../../api";

import { useAuthStore } from "../../store";

export default function Product() {

    const { id } = useParams();

    const addToCart = useAuthStore((state) => state.addToCart);

    const [product, setProduct] = useState<IProduct | null>(null);
    const [error, setError] = useState("");

    const thumbnailsRef = useRef<HTMLDivElement>(null);

    const [quantity, setQuantity] = useState(1)
    
    const [selectedImage, setSelectedImage] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
        try {
            const data = await getProductById(Number(id));
            setProduct(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Impossible de récupérer le produit."
            );
        }
    };

    loadProduct();
    }, [id]);

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

    if (error) {
        return <p>{error}</p>;
    }

    if (!product) {
        return <p>Chargement du produit...</p>;
    }

    const images = [
        ...product.pictures.filter((image) => image.isMain),
        ...product.pictures.filter((image) => !image.isMain),
    ];

    return (
        <main className="product-page">

            {/* ========================================
                GALERIE
            ======================================== */}

            <section className="product-gallery">

                {/* IMAGE PRINCIPALE */}

                <div className="product-main-image" onClick={() => setIsLightboxOpen(true)}>
                    <img
                        src={`${import.meta.env.VITE_API_URL}${images[selectedImage].url}`}
                        alt={images[selectedImage].alt}
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
                                        src={`${import.meta.env.VITE_API_URL}${image.url}`}
                                        alt={image.alt}
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
                    {product.name}
                </h1>

                <p className="product-description">
                    {product.description}
                </p>

                <div className="product-dimensions">
                    <h2 className="low-title">
                        Dimensions
                    </h2>

                    <div className="product-dimensions-values">
                        <p>Hauteur : {product.height} cm</p>

                        <div className="product-dimensions-bottom">
                            <p>Longueur : {product.length} cm</p>
                            <p>Largeur : {product.width} cm</p>
                        </div>

                        <p>Poids : {product.weight} g</p>
                        
                    </div>
                </div>

                <p className="product-price">
                    {Number(product.price).toFixed(2).replace(".", ",")} €
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
                            onClick={() => setQuantity((current) =>
                                Math.min(product.stockQuantity, current + 1)
                            )}
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        className="product-add-button"
                        onClick={() => addToCart(product, quantity)}
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
                        src={`${import.meta.env.VITE_API_URL}${images[selectedImage].url}`}
                        alt={images[selectedImage].alt}
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