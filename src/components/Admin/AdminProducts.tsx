import { useEffect, useMemo, useState } from "react";

import {
    getCategories,
    getAdminProducts,
    updateProduct,
} from "../../api";

import type { ICategory, IProduct } from "../../@types";

import "./admin-products.css";

export default function AdminProducts() {

    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [productToToggle, setProductToToggle] = useState<IProduct | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [actionLoading, setActionLoading] = useState<number | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const [productsData, categoriesData] = await Promise.all([
                    getAdminProducts(),
                    getCategories(),
                ]);

                setProducts(productsData);
                setCategories(categoriesData);

            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de récupérer les données."
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" ||
                product.categoryId === Number(categoryFilter);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && product.active) ||
                (statusFilter === "inactive" && !product.active);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });
    }, [products, search, categoryFilter, statusFilter]);

    async function handleToggleProduct(product: IProduct) {
        try {
            setActionLoading(product.id);
            setError("");
            setSuccessMessage("");

            await updateProduct(product.id, {
                active: !product.active,
            });

            setProducts((currentProducts) =>
                currentProducts.map((currentProduct) =>
                    currentProduct.id === product.id
                        ? {
                            ...currentProduct,
                            active: !currentProduct.active,
                        }
                        : currentProduct
                )
            );

            setProductToToggle(null);

            setSuccessMessage(
                product.active
                    ? `Le produit « ${product.name} » a été désactivé avec succès.`
                    : `Le produit « ${product.name} » a été activé avec succès.`
            );

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Impossible de modifier le produit."
            );
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <section className="admin-products-page">

            <header className="admin-section-header">
                <h1 className="main-title">
                    Produits
                </h1>

                <p>
                    Gérez les produits de Gravelya Studio.
                </p>
            </header>

            <div className="admin-products-actions">

                <div className="admin-products-filters">

                    <input
                        type="search"
                        placeholder="Rechercher un produit..."
                        aria-label="Rechercher un produit"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <select
                        value={categoryFilter}
                        onChange={(event) =>
                            setCategoryFilter(event.target.value)
                        }
                        aria-label="Filtrer par catégorie"
                    >
                        <option value="all">
                            Toutes les catégories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        aria-label="Filtrer par statut"
                    >
                        <option value="all">
                            Tous les produits
                        </option>

                        <option value="active">
                            Actifs
                        </option>

                        <option value="inactive">
                            Inactifs
                        </option>
                    </select>

                </div>

                <button className="admin-add-button">
                    + Ajouter un produit
                </button>

            </div>

            {error && (
                <p>
                    {error}
                </p>
            )}

            {successMessage && (
                <p
                    className="admin-success-message"
                    role="status"
                >
                    {successMessage}
                </p>
            )}

            <div className="admin-products-list">

                {loading && (
                    <p>
                        Chargement des produits...
                    </p>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <p>
                        Aucun produit ne correspond à votre recherche.
                    </p>
                )}

                {!loading && filteredProducts.map((product) => (

                    <article
                        className="admin-product-card"
                        key={product.id}
                    >

                        <div className="admin-product-image">
                            <span>
                                Image
                            </span>
                        </div>

                        <div className="admin-product-info">

                            <h2>
                                {product.name}
                            </h2>

                            <span className="admin-product-category">
                                {product.category.name}
                            </span>

                            <div className="admin-product-details">

                                <span>
                                    {Number(product.price)
                                        .toFixed(2)
                                        .replace(".", ",")} €
                                </span>

                                <span>
                                    Stock : {product.stockQuantity}
                                </span>

                            </div>

                        </div>

                        <span
                            className={`admin-product-status ${
                                product.active
                                    ? "active"
                                    : "inactive"
                            }`}
                        >
                            {product.active ? "Actif" : "Inactif"}
                        </span>

                        <div className="admin-product-actions">

                            <button
                                className="admin-edit-button"
                            >
                                Modifier
                            </button>

                            {product.active ? (
                                <button
                                    className="admin-delete-button"
                                    onClick={() => setProductToToggle(product)}
                                    disabled={actionLoading === product.id}
                                >
                                    Désactiver
                                </button>
                            ) : (
                                <button
                                    className="admin-activate-button"
                                    onClick={() => setProductToToggle(product)}
                                    disabled={actionLoading === product.id}
                                >
                                    Activer
                                </button>
                            )}

                        </div>

                    </article>

                ))}

            </div>

            {productToToggle && (
                <div
                    className="admin-confirm-overlay"
                    onClick={() => setProductToToggle(null)}
                >
                    <div
                        className="admin-confirm-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="admin-confirm-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 id="admin-confirm-title">
                            {productToToggle.active
                                ? "Désactiver le produit ?"
                                : "Activer le produit ?"}
                        </h2>

                        <p>
                            {productToToggle.active
                                ? `Voulez-vous vraiment désactiver « ${productToToggle.name} » ?`
                                : `Voulez-vous vraiment activer « ${productToToggle.name} » ?`}
                        </p>

                        <div className="admin-confirm-actions">

                            <button
                                type="button"
                                className="admin-confirm-cancel"
                                onClick={() => setProductToToggle(null)}
                                disabled={actionLoading === productToToggle.id}
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className={
                                    productToToggle.active
                                        ? "admin-confirm-danger"
                                        : "admin-confirm-success"
                                }
                                onClick={() => handleToggleProduct(productToToggle)}
                                disabled={actionLoading === productToToggle.id}
                            >
                                {actionLoading === productToToggle.id
                                    ? "Chargement..."
                                    : productToToggle.active
                                        ? "Désactiver"
                                        : "Activer"}
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </section>
    );
}