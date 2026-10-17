
import "./product.css";

import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import type {
  IProduct,
  IProductCustomization,
} from "../../@types";
import { getProductById } from "../../api";
import { useAuthStore } from "../../store";

export default function Product() {
  const { id } = useParams();
  const addToCart = useAuthStore((state) => state.addToCart);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [selectedColor, setSelectedColor] = useState("");
  const [customText, setCustomText] = useState("");
  const [customizationError, setCustomizationError] = useState("");

  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadProduct = async () => {
      try {
        setProduct(null);
        setError("");
        setCustomizationError("");
        setQuantity(1);
        setSelectedImage(0);
        setSelectedColor("");
        setCustomText("");

        const data = await getProductById(Number(id));

        if (!cancelled) {
          setProduct(data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Impossible de récupérer le produit."
          );
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
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

  if (error) return <p>{error}</p>;
  if (!product) return <p>Chargement du produit...</p>;

  const images = [
    ...product.pictures.filter((image) => image.isMain),
    ...product.pictures.filter((image) => !image.isMain),
  ];

  const customizationOptions = product.customizationOptions ?? {};
  const colors = customizationOptions.colors ?? [];
  const textOptions = customizationOptions.text;

  const textEnabled = textOptions?.enabled === true;
  const textRequired = textEnabled && textOptions.required === true;
  const maxTextLength = Math.max(1, textOptions?.maxLength ?? 30);

  const maxQuantity = product.madeToOrder
    ? 100
    : Math.max(0, product.stockQuantity);

  const hasStock = product.madeToOrder || product.stockQuantity > 0;

  const handleAddToCart = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setCustomizationError("");

    if (colors.length > 0 && !selectedColor) {
      setCustomizationError("Veuillez choisir une couleur.");
      return;
    }

    if (
      textRequired &&
      !customText.trim()
    ) {
      setCustomizationError(
        "Veuillez renseigner le texte personnalisé."
      );
      return;
    }

    if (
      textEnabled &&
      customText.trim().length > maxTextLength
    ) {
      setCustomizationError(
        `Le texte ne doit pas dépasser ${maxTextLength} caractères.`
      );
      return;
    }

    if (!hasStock) {
      setCustomizationError("Ce produit est actuellement indisponible.");
      return;
    }

    const customization: IProductCustomization = {};

    if (colors.length > 0) {
      customization.color = selectedColor;
    }

    if (textEnabled && customText.trim()) {
      customization.text = customText.trim();
    }

    addToCart(
      product,
      Math.min(quantity, maxQuantity),
      customization
    );
  };

  return (
    <main className="product-page">
      <section className="product-gallery">
        {images.length > 0 && (
          <>
            <div
              className="product-main-image"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${images[selectedImage].url}`}
                alt={images[selectedImage].alt}
              />
            </div>

            {images.length > 1 && (
              <div className="product-thumbnails-container">
                <button
                  type="button"
                  className="product-thumbnails-arrow product-thumbnails-arrow-left"
                  onClick={() => scrollThumbnails("left")}
                  aria-label="Voir les images précédentes"
                >
                  ←
                </button>

                <div
                  className="product-thumbnails"
                  ref={thumbnailsRef}
                >
                  <div className="product-thumbnails-list">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        type="button"
                        className={`product-thumbnail ${
                          selectedImage === index ? "active" : ""
                        }`}
                        onClick={() => setSelectedImage(index)}
                        aria-label={`Afficher l'image ${index + 1}`}
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
                  aria-label="Voir les images suivantes"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="product-info">
        <h1 className="main-title">{product.name}</h1>

        <p className="product-description">{product.description}</p>

        <div className="product-dimensions">
          <h2 className="low-title">Dimensions</h2>

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

        <form
          className="product-customization-form"
          onSubmit={handleAddToCart}
        >
          {(colors.length > 0 || textEnabled) && (
            <div className="product-customization">
              <h2 className="product-customization-title">
                Personnalisez votre produit
              </h2>

              {colors.length > 0 && (
                <div className="product-customization-field">
                  <label htmlFor="product-color">
                    Couleur <span aria-hidden="true">*</span>
                  </label>

                  <select
                    id="product-color"
                    value={selectedColor}
                    onChange={(event) => {
                      setSelectedColor(event.target.value);
                      setCustomizationError("");
                    }}
                    required
                  >
                    <option value="">Choisir une couleur</option>

                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {textEnabled && (
                <div className="product-customization-field">
                  <label htmlFor="product-custom-text">
                    {textOptions.label?.trim() || "Texte personnalisé"}
                    {textRequired && (
                      <span aria-hidden="true"> *</span>
                    )}
                  </label>

                  <input
                    id="product-custom-text"
                    type="text"
                    value={customText}
                    onChange={(event) => {
                      setCustomText(event.target.value);
                      setCustomizationError("");
                    }}
                    placeholder={
                      textOptions.placeholder ?? ""
                    }
                    maxLength={maxTextLength}
                    required={textRequired}
                  />

                  <p className="product-customization-hint">
                    {customText.length}/{maxTextLength} caractères
                  </p>
                </div>
              )}
            </div>
          )}

          {customizationError && (
            <p
              className="product-customization-error"
              role="alert"
            >
              {customizationError}
            </p>
          )}

          {!hasStock && (
            <p className="product-customization-error" role="status">
              Ce produit est actuellement indisponible.
            </p>
          )}

          <div className="product-purchase">
            <div className="product-quantity">
              <button
                type="button"
                className="product-quantity-button"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                aria-label="Diminuer la quantité"
              >
                −
              </button>

              <span className="product-quantity-value">
                {quantity}
              </span>

              <button
                type="button"
                className="product-quantity-button"
                onClick={() =>
                  setQuantity((current) =>
                    Math.min(maxQuantity, current + 1)
                  )
                }
                disabled={quantity >= maxQuantity}
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>

            <button
              type="submit"
              className="product-add-button"
              disabled={!hasStock}
            >
              Ajouter au panier
            </button>
          </div>
        </form>
      </section>

      {isLightboxOpen && images.length > 0 && (
        <div
          className="product-lightbox"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            className="product-lightbox-close"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Fermer la galerie"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="product-lightbox-arrow product-lightbox-arrow-left"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImage((current) =>
                  current === 0 ? images.length - 1 : current - 1
                );
              }}
              aria-label="Image précédente"
            >
              ←
            </button>
          )}

          <img
            className="product-lightbox-image"
            src={`${import.meta.env.VITE_API_URL}${images[selectedImage].url}`}
            alt={images[selectedImage].alt}
            onClick={(event) => event.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              className="product-lightbox-arrow product-lightbox-arrow-right"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImage((current) =>
                  current === images.length - 1 ? 0 : current + 1
                );
              }}
              aria-label="Image suivante"
            >
              →
            </button>
          )}
        </div>
      )}
    </main>
  );
}
