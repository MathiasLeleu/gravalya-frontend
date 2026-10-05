import { useEffect, useMemo, useState } from "react";

import {
    getCategories,
    getAdminProducts,
    updateProduct,
} from "../../api";

import type { ICategory, IProduct } from "../../@types";

import "./admin-products.css";

interface IEditProductForm {
    name: string;
    description: string;
    price: string;
    weight: string;
    height: string;
    length: string;
    width: string;
    stockQuantity: string;
    categoryId: string;
}

export default function AdminProducts() {

    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [productToToggle, setProductToToggle] = useState<IProduct | null>(null);
    const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const [editForm, setEditForm] = useState<IEditProductForm>({
        name: "",
        description: "",
        price: "",
        weight: "",
        height: "",
        length: "",
        width: "",
        stockQuantity: "",
        categoryId: "",
    });

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

    function openEditModal(product: IProduct) {
        setProductToEdit(product);

        setEditForm({
            name: product.name,
            description: product.description,
            price: product.price,
            weight: product.weight,
            height: product.height,
            length: product.length,
            width: product.width,
            stockQuantity: String(product.stockQuantity),
            categoryId: String(product.categoryId),
        });

        setError("");
        setSuccessMessage("");
    }

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

    async function handleUpdateProduct() {
        if (!productToEdit) {
            return;
        }

        if (
            !editForm.name.trim() ||
            !editForm.description.trim() ||
            !editForm.price ||
            !editForm.weight ||
            !editForm.height ||
            !editForm.length ||
            !editForm.width ||
            !editForm.stockQuantity ||
            !editForm.categoryId
        ) {
            setError("Tous les champs du produit sont requis.");
            return;
        }

        const price = Number(editForm.price);
        const weight = Number(editForm.weight);
        const height = Number(editForm.height);
        const length = Number(editForm.length);
        const width = Number(editForm.width);
        const stockQuantity = Number(editForm.stockQuantity);
        const categoryId = Number(editForm.categoryId);

        if (
            Number.isNaN(price) ||
            Number.isNaN(weight) ||
            Number.isNaN(height) ||
            Number.isNaN(length) ||
            Number.isNaN(width) ||
            Number.isNaN(stockQuantity) ||
            Number.isNaN(categoryId)
        ) {
            setError("Veuillez saisir des valeurs valides.");
            return;
        }

        if (
            price < 0 ||
            weight < 0 ||
            height < 0 ||
            length < 0 ||
            width < 0 ||
            stockQuantity < 0
        ) {
            setError("Les valeurs numériques ne peuvent pas être négatives.");
            return;
        }

        try {
            setActionLoading(productToEdit.id);
            setError("");
            setSuccessMessage("");

            const updatedProduct = await updateProduct(
                productToEdit.id,
                {
                    name: editForm.name.trim(),
                    description: editForm.description.trim(),
                    price,
                    weight,
                    height,
                    length,
                    width,
                    stockQuantity,
                    categoryId,
                }
            );

            const updatedCategory = categories.find(
                (category) => category.id === categoryId
            );

            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.id === productToEdit.id
                        ? {
                            ...product,
                            ...updatedProduct,
                            categoryId,
                            category: updatedCategory ?? product.category,
                        }
                        : product
                )
            );

            setProductToEdit(null);

            setSuccessMessage(
                `Le produit « ${editForm.name.trim()} » a été modifié avec succès.`
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
                                onClick={() => openEditModal(product)}
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

            {productToEdit && (
                <div
                    className="admin-edit-overlay"
                    onClick={() => setProductToEdit(null)}
                >
                    <div
                        className="admin-edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="admin-edit-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="admin-edit-modal-header">

                            <h2 id="admin-edit-title">
                                Modifier le produit
                            </h2>

                            <button
                                type="button"
                                className="admin-edit-close"
                                onClick={() => setProductToEdit(null)}
                                aria-label="Fermer"
                            >
                                ×
                            </button>

                        </header>

                        <div className="admin-edit-form">

                            <div className="admin-edit-field">
                                <label htmlFor="edit-product-name">
                                    Nom
                                </label>

                                <input
                                    id="edit-product-name"
                                    type="text"
                                    value={editForm.name}
                                    onChange={(event) =>
                                        setEditForm({
                                            ...editForm,
                                            name: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="admin-edit-field">
                                <label htmlFor="edit-product-description">
                                    Description
                                </label>

                                <textarea
                                    id="edit-product-description"
                                    value={editForm.description}
                                    onChange={(event) =>
                                        setEditForm({
                                            ...editForm,
                                            description: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="admin-edit-row">

                                <div className="admin-edit-field">
                                    <label htmlFor="edit-product-price">
                                        Prix
                                    </label>

                                    <input
                                        id="edit-product-price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editForm.price}
                                        onChange={(event) =>
                                            setEditForm({
                                                ...editForm,
                                                price: event.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="admin-edit-field">
                                    <label htmlFor="edit-product-stock">
                                        Stock
                                    </label>

                                    <input
                                        id="edit-product-stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={editForm.stockQuantity}
                                        onChange={(event) =>
                                            setEditForm({
                                                ...editForm,
                                                stockQuantity: event.target.value,
                                            })
                                        }
                                    />
                                </div>

                            </div>

                            <div className="admin-edit-field">
                                <label htmlFor="edit-product-category">
                                    Catégorie
                                </label>

                                <select
                                    id="edit-product-category"
                                    value={editForm.categoryId}
                                    onChange={(event) =>
                                        setEditForm({
                                            ...editForm,
                                            categoryId: event.target.value,
                                        })
                                    }
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-edit-row">

                                <div className="admin-edit-field">
                                    <label htmlFor="edit-product-weight">
                                        Poids
                                    </label>

                                    <input
                                        id="edit-product-weight"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editForm.weight}
                                        onChange={(event) =>
                                            setEditForm({
                                                ...editForm,
                                                weight: event.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="admin-edit-field">
                                    <label htmlFor="edit-product-height">
                                        Hauteur
                                    </label>

                                    <input
                                        id="edit-product-height"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editForm.height}
                                        onChange={(event) =>
                                            setEditForm({
                                                ...editForm,
                                                height: event.target.value,
                                            })
                                        }
                                    />
                                </div>

                            </div>

                            <div className="admin-edit-row">

                                <div className="admin-edit-field">
                                    <label htmlFor="edit-product-length">
                                        Longueur
                                    </label>

                                    <input
                                        id="edit-product-length"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editForm.length}
                                        onChange={(event) =>
                                            setEditForm({
                                                ...editForm,
                                                length: event.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="admin-edit-field">
                                    <label htmlFor="edit-product-width">
                                        Largeur
                                    </label>

                                    <input
                                        id="edit-product-width"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editForm.width}
                                        onChange={(event) =>
                                            setEditForm({
                                                ...editForm,
                                                width: event.target.value,
                                            })
                                        }
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="admin-edit-actions">

                            <button
                                type="button"
                                className="admin-confirm-cancel"
                                onClick={() => setProductToEdit(null)}
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="admin-confirm-success"
                                onClick={handleUpdateProduct}
                                disabled={
                                    productToEdit !== null &&
                                    actionLoading === productToEdit.id
                                }
                            >
                                {productToEdit !== null &&
                                actionLoading === productToEdit.id
                                    ? "Enregistrement..."
                                    : "Enregistrer"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </section>
    );
}