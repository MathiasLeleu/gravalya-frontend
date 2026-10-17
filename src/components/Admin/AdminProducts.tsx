
import { useEffect, useMemo, useState } from "react";

import {
    getCategories,
    getAdminProducts,
    createProduct,
    updateProduct,
    getProductPictures,
    updatePicture,
    uploadProductPicture,
    deletePicture,
} from "../../api";

import type {
    ICategory,
    IProduct,
    IPicture,
    ICreateProductForm,
    IEditProductForm,
} from "../../@types";

import "./admin-products.css";

export default function AdminProducts() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [productToToggle, setProductToToggle] = useState<IProduct | null>(null);
    const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);
    const [createLoading, setCreateLoading] = useState(false);

    const [productPictures, setProductPictures] = useState<IPicture[]>([]);
    const [picturesLoading, setPicturesLoading] = useState(false);
    const [pictureActionLoading, setPictureActionLoading] = useState<number | null>(null);

    const [pictureFile, setPictureFile] = useState<File | null>(null);
    const [pictureAlt, setPictureAlt] = useState("");
    const [pictureIsMain, setPictureIsMain] = useState(false);
    const [pictureUploadLoading, setPictureUploadLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [createForm, setCreateForm] = useState<ICreateProductForm>({
        name: "",
        description: "",
        price: "",
        weight: "",
        height: "",
        length: "",
        width: "",
        stockQuantity: "",
        categoryId: "",
        madeToOrder: false,
        customizationColors: "",
        customizationTextEnabled: false,
        customizationTextLabel: "Texte personnalisé",
        customizationTextRequired: false,
        customizationTextMaxLength: "30",
        customizationTextPlaceholder: "",
    });

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
        madeToOrder: false,
        customizationColors: "",
        customizationTextEnabled: false,
        customizationTextLabel: "Texte personnalisé",
        customizationTextRequired: false,
        customizationTextMaxLength: "30",
        customizationTextPlaceholder: "",
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
            const matchesSearch = product.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" ||
                product.categoryId === Number(categoryFilter);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && product.active) ||
                (statusFilter === "inactive" && !product.active);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, search, categoryFilter, statusFilter]);

    async function openEditModal(product: IProduct) {
        setProductToEdit(product);

        setEditForm({
            name: product.name,
            description: product.description,
            price: String(product.price),
            weight: String(product.weight),
            height: String(product.height),
            length: String(product.length),
            width: String(product.width),
            stockQuantity: String(product.stockQuantity),
            categoryId: String(product.categoryId),
            madeToOrder: product.madeToOrder ?? false,
            customizationColors: (
                product.customizationOptions?.colors ?? []
            ).join(", "),
            customizationTextEnabled:
                product.customizationOptions?.text?.enabled ?? false,
            customizationTextLabel:
                product.customizationOptions?.text?.label ??
                "Texte personnalisé",
            customizationTextRequired:
                product.customizationOptions?.text?.required ?? false,
            customizationTextMaxLength: String(
                product.customizationOptions?.text?.maxLength ?? 30
            ),
            customizationTextPlaceholder:
                product.customizationOptions?.text?.placeholder ?? "",
        });

        setError("");
        setSuccessMessage("");
        setPictureFile(null);
        setPictureAlt("");
        setPictureIsMain(false);
        setPicturesLoading(true);

        try {
            const pictures = await getProductPictures(product.id);

            setProductPictures(
                [...pictures].sort(
                    (a, b) => Number(b.isMain) - Number(a.isMain)
                )
            );
        } catch (error) {
            setProductPictures([]);

            setError(
                error instanceof Error
                    ? error.message
                    : "Impossible de récupérer les images du produit."
            );
        } finally {
            setPicturesLoading(false);
        }
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

    async function handleCreateProduct() {
        setError("");
        setSuccessMessage("");

        if (
            !createForm.name.trim() ||
            !createForm.description.trim() ||
            !createForm.price ||
            !createForm.weight ||
            !createForm.height ||
            !createForm.length ||
            !createForm.width ||
            (!createForm.madeToOrder && !createForm.stockQuantity) ||
            !createForm.categoryId
        ) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        const price = Number(createForm.price);
        const weight = Number(createForm.weight);
        const height = Number(createForm.height);
        const length = Number(createForm.length);
        const width = Number(createForm.width);
        const stockQuantity = Number(createForm.stockQuantity || 0);
        const categoryId = Number(createForm.categoryId);

        if (
            !Number.isFinite(price) ||
            !Number.isFinite(weight) ||
            !Number.isFinite(height) ||
            !Number.isFinite(length) ||
            !Number.isFinite(width) ||
            !Number.isInteger(stockQuantity) ||
            !Number.isInteger(categoryId)
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
            stockQuantity < 0 ||
            categoryId <= 0
        ) {
            setError("Les valeurs numériques saisies sont invalides.");
            return;
        }

        const colors = createForm.customizationColors
            .split(",")
            .map((color) => color.trim())
            .filter(Boolean);

        const textEnabled = createForm.customizationTextEnabled;
        const textMaxLength = Number(createForm.customizationTextMaxLength);

        if (
            textEnabled &&
            (!Number.isInteger(textMaxLength) ||
                textMaxLength < 1 ||
                textMaxLength > 200)
        ) {
            setError(
                "La longueur maximale du texte doit être comprise entre 1 et 200 caractères."
            );
            return;
        }

        const customizationOptions = {
            ...(colors.length > 0 ? { colors } : {}),
            ...(textEnabled
                ? {
                      text: {
                          enabled: true,
                          label:
                              createForm.customizationTextLabel.trim() ||
                              "Texte personnalisé",
                          required: createForm.customizationTextRequired,
                          maxLength: textMaxLength,
                          placeholder:
                              createForm.customizationTextPlaceholder.trim(),
                      },
                  }
                : {}),
        };

        try {
            setCreateLoading(true);

            const product = await createProduct({
                name: createForm.name.trim(),
                description: createForm.description.trim(),
                price,
                weight,
                height,
                length,
                width,
                stockQuantity,
                categoryId,
                madeToOrder: createForm.madeToOrder,
                customizationOptions,
            });

            const updatedProducts = await getAdminProducts();

            setProducts(updatedProducts);
            setIsCreateModalOpen(false);

            setSuccessMessage(
                `Le produit « ${product.name} » a été ajouté avec succès.`
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Impossible de créer le produit."
            );
        } finally {
            setCreateLoading(false);
        }
    }

    async function handleUpdateProduct() {
        if (!productToEdit) {
            return;
        }

        setError("");
        setSuccessMessage("");

        if (
            !editForm.name.trim() ||
            !editForm.description.trim() ||
            !editForm.price ||
            !editForm.weight ||
            !editForm.height ||
            !editForm.length ||
            !editForm.width ||
            (!editForm.madeToOrder && !editForm.stockQuantity) ||
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
        const stockQuantity = Number(editForm.stockQuantity || 0);
        const categoryId = Number(editForm.categoryId);

        if (
            !Number.isFinite(price) ||
            !Number.isFinite(weight) ||
            !Number.isFinite(height) ||
            !Number.isFinite(length) ||
            !Number.isFinite(width) ||
            !Number.isInteger(stockQuantity) ||
            !Number.isInteger(categoryId)
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
            stockQuantity < 0 ||
            categoryId <= 0
        ) {
            setError("Les valeurs numériques saisies sont invalides.");
            return;
        }

        const colors = editForm.customizationColors
            .split(",")
            .map((color) => color.trim())
            .filter(Boolean);

        const textEnabled = editForm.customizationTextEnabled;
        const textMaxLength = Number(editForm.customizationTextMaxLength);

        if (
            textEnabled &&
            (!Number.isInteger(textMaxLength) ||
                textMaxLength < 1 ||
                textMaxLength > 200)
        ) {
            setError(
                "La longueur maximale du texte doit être comprise entre 1 et 200 caractères."
            );
            return;
        }

        const customizationOptions = {
            ...(colors.length > 0 ? { colors } : {}),
            ...(textEnabled
                ? {
                      text: {
                          enabled: true,
                          label:
                              editForm.customizationTextLabel.trim() ||
                              "Texte personnalisé",
                          required: editForm.customizationTextRequired,
                          maxLength: textMaxLength,
                          placeholder:
                              editForm.customizationTextPlaceholder.trim(),
                      },
                  }
                : {}),
        };

        try {
            setActionLoading(productToEdit.id);

            const updatedProduct = await updateProduct(productToEdit.id, {
                name: editForm.name.trim(),
                description: editForm.description.trim(),
                price,
                weight,
                height,
                length,
                width,
                stockQuantity,
                categoryId,
                madeToOrder: editForm.madeToOrder,
                customizationOptions,
            });

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

    async function handleUploadPicture() {
        if (!productToEdit) {
            return;
        }

        setError("");
        setSuccessMessage("");

        if (!pictureFile) {
            setError("Veuillez sélectionner une image.");
            return;
        }

        if (!pictureAlt.trim()) {
            setError("Le texte alternatif est requis.");
            return;
        }

        try {
            setPictureUploadLoading(true);

            await uploadProductPicture(
                productToEdit.id,
                pictureFile,
                pictureAlt.trim(),
                pictureIsMain
            );

            const updatedPictures = await getProductPictures(productToEdit.id);

            setProductPictures(
                [...updatedPictures].sort(
                    (a, b) => Number(b.isMain) - Number(a.isMain)
                )
            );

            setPictureFile(null);
            setPictureAlt("");
            setPictureIsMain(false);

            setSuccessMessage("L'image a été ajoutée avec succès.");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Impossible d'ajouter l'image."
            );
        } finally {
            setPictureUploadLoading(false);
        }
    }

    async function handleSetMainPicture(picture: IPicture) {
        if (!productToEdit || picture.isMain) {
            return;
        }

        try {
            setPictureActionLoading(picture.id);
            setError("");
            setSuccessMessage("");

            await updatePicture(productToEdit.id, picture.id, {
                isMain: true,
            });

            const updatedPictures = await getProductPictures(productToEdit.id);

            setProductPictures(
                [...updatedPictures].sort(
                    (a, b) => Number(b.isMain) - Number(a.isMain)
                )
            );

            setSuccessMessage(
                "L'image a été définie comme image principale."
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Impossible de définir l'image principale."
            );
        } finally {
            setPictureActionLoading(null);
        }
    }

    async function handleDeletePicture(picture: IPicture) {
        if (!productToEdit) {
            return;
        }

        if (picture.isMain) {
            setError(
                "L'image principale ne peut pas être supprimée pour le moment."
            );
            return;
        }

        try {
            setPictureActionLoading(picture.id);
            setError("");
            setSuccessMessage("");

            await deletePicture(productToEdit.id, picture.id);

            setProductPictures((currentPictures) =>
                currentPictures.filter(
                    (currentPicture) => currentPicture.id !== picture.id
                )
            );

            setSuccessMessage("L'image a été supprimée avec succès.");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Impossible de supprimer l'image."
            );
        } finally {
            setPictureActionLoading(null);
        }
    }

    return (
        <section className="admin-products-page">
            <header className="admin-section-header">
                <h1 className="main-title">Produits</h1>
                <p>Gérez les produits de Gravelya Studio.</p>
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
                        <option value="all">Toutes les catégories</option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
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
                        <option value="all">Tous les produits</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Inactifs</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="admin-add-button"
                    onClick={() => {
                        setCreateForm({
                            name: "",
                            description: "",
                            price: "",
                            weight: "",
                            height: "",
                            length: "",
                            width: "",
                            stockQuantity: "",
                            categoryId:
                                categories.length > 0
                                    ? String(categories[0].id)
                                    : "",
                            madeToOrder: false,
                            customizationColors: "",
                            customizationTextEnabled: false,
                            customizationTextLabel: "Texte personnalisé",
                            customizationTextRequired: false,
                            customizationTextMaxLength: "30",
                            customizationTextPlaceholder: "",
                        });

                        setError("");
                        setSuccessMessage("");
                        setIsCreateModalOpen(true);
                    }}
                >
                    + Ajouter un produit
                </button>
            </div>

            {error && <p role="alert">{error}</p>}

            {successMessage && (
                <p className="admin-success-message" role="status">
                    {successMessage}
                </p>
            )}

            <div className="admin-products-list">
                {loading && <p>Chargement des produits...</p>}

                {!loading && filteredProducts.length === 0 && (
                    <p>Aucun produit ne correspond à votre recherche.</p>
                )}

                {!loading &&
                    filteredProducts.map((product) => (
                        <article
                            className="admin-product-card"
                            key={product.id}
                        >
                            <div className="admin-product-image">
                                <span>Image</span>
                            </div>

                            <div className="admin-product-info">
                                <h2>{product.name}</h2>

                                <span className="admin-product-category">
                                    {product.category?.name ?? "Sans catégorie"}
                                </span>

                                <div className="admin-product-details">
                                    <span>
                                        {Number(product.price)
                                            .toFixed(2)
                                            .replace(".", ",")}{" "}
                                        €
                                    </span>

                                    <span>
                                        {product.madeToOrder
                                            ? "Fabriqué à la commande"
                                            : `Stock : ${product.stockQuantity}`}
                                    </span>
                                </div>
                            </div>

                            <span
                                className={`admin-product-status ${
                                    product.active ? "active" : "inactive"
                                }`}
                            >
                                {product.active ? "Actif" : "Inactif"}
                            </span>

                            <div className="admin-product-actions">
                                <button
                                    type="button"
                                    className="admin-edit-button"
                                    onClick={() => openEditModal(product)}
                                >
                                    Modifier
                                </button>

                                {product.active ? (
                                    <button
                                        type="button"
                                        className="admin-delete-button"
                                        onClick={() =>
                                            setProductToToggle(product)
                                        }
                                        disabled={actionLoading === product.id}
                                    >
                                        Désactiver
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="admin-activate-button"
                                        onClick={() =>
                                            setProductToToggle(product)
                                        }
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
                                disabled={
                                    actionLoading === productToToggle.id
                                }
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
                                onClick={() =>
                                    handleToggleProduct(productToToggle)
                                }
                                disabled={
                                    actionLoading === productToToggle.id
                                }
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

            {/* MODALE DE CRÉATION */}
            {isCreateModalOpen && (
                <div
                    className="admin-edit-overlay"
                    onClick={() => setIsCreateModalOpen(false)}
                >
                    <div
                        className="admin-edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="admin-create-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="admin-edit-modal-header">
                            <h2 id="admin-create-title">
                                Ajouter un produit
                            </h2>

                            <button
                                type="button"
                                className="admin-edit-close"
                                onClick={() => setIsCreateModalOpen(false)}
                                aria-label="Fermer"
                            >
                                ×
                            </button>
                        </header>

                        <div className="admin-edit-form">
                            <div className="admin-edit-field">
                                <label htmlFor="create-product-name">Nom</label>
                                <input
                                    id="create-product-name"
                                    type="text"
                                    value={createForm.name}
                                    onChange={(event) =>
                                        setCreateForm({
                                            ...createForm,
                                            name: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="admin-edit-field">
                                <label htmlFor="create-product-description">
                                    Description
                                </label>
                                <textarea
                                    id="create-product-description"
                                    value={createForm.description}
                                    onChange={(event) =>
                                        setCreateForm({
                                            ...createForm,
                                            description: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="admin-edit-row">
                                <div className="admin-edit-field">
                                    <label htmlFor="create-product-price">
                                        Prix
                                    </label>
                                    <input
                                        id="create-product-price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={createForm.price}
                                        onChange={(event) =>
                                            setCreateForm({
                                                ...createForm,
                                                price: event.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="admin-edit-field">
                                    <label htmlFor="create-product-stock">
                                        Stock
                                    </label>
                                    <input
                                        id="create-product-stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        disabled={createForm.madeToOrder}
                                        value={createForm.stockQuantity}
                                        onChange={(event) =>
                                            setCreateForm({
                                                ...createForm,
                                                stockQuantity: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={createForm.madeToOrder}
                                    onChange={(event) =>
                                        setCreateForm({
                                            ...createForm,
                                            madeToOrder: event.target.checked,
                                        })
                                    }
                                />{" "}
                                Produit fabriqué à la commande (pas de stock à
                                gérer)
                            </label>

                            <div className="admin-edit-field">
                                <label htmlFor="create-product-category">
                                    Catégorie
                                </label>
                                <select
                                    id="create-product-category"
                                    value={createForm.categoryId}
                                    onChange={(event) =>
                                        setCreateForm({
                                            ...createForm,
                                            categoryId: event.target.value,
                                        })
                                    }
                                >
                                    <option value="" disabled>
                                        Choisir une catégorie
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
                            </div>

                            <div className="admin-edit-field">
                                <label htmlFor="create-product-colors">
                                    Couleurs disponibles (séparées par des
                                    virgules)
                                </label>
                                <input
                                    id="create-product-colors"
                                    type="text"
                                    placeholder="Rouge, Bleu, Vert"
                                    value={createForm.customizationColors}
                                    onChange={(event) =>
                                        setCreateForm({
                                            ...createForm,
                                            customizationColors:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={createForm.customizationTextEnabled}
                                    onChange={(event) =>
                                        setCreateForm({
                                            ...createForm,
                                            customizationTextEnabled:
                                                event.target.checked,
                                        })
                                    }
                                />{" "}
                                Autoriser un texte personnalisé
                            </label>

                            {createForm.customizationTextEnabled && (
                                <>
                                    <div className="admin-edit-field">
                                        <label htmlFor="create-text-label">
                                            Libellé du champ texte
                                        </label>
                                        <input
                                            id="create-text-label"
                                            type="text"
                                            value={
                                                createForm.customizationTextLabel
                                            }
                                            onChange={(event) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    customizationTextLabel:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="admin-edit-field">
                                        <label htmlFor="create-text-max-length">
                                            Longueur maximale (1 à 200)
                                        </label>
                                        <input
                                            id="create-text-max-length"
                                            type="number"
                                            min="1"
                                            max="200"
                                            step="1"
                                            value={
                                                createForm.customizationTextMaxLength
                                            }
                                            onChange={(event) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    customizationTextMaxLength:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="admin-edit-field">
                                        <label htmlFor="create-text-placeholder">
                                            Texte indicatif
                                        </label>
                                        <input
                                            id="create-text-placeholder"
                                            type="text"
                                            placeholder="Ex. : Indiquez le prénom"
                                            value={
                                                createForm.customizationTextPlaceholder
                                            }
                                            onChange={(event) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    customizationTextPlaceholder:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={
                                                createForm.customizationTextRequired
                                            }
                                            onChange={(event) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    customizationTextRequired:
                                                        event.target.checked,
                                                })
                                            }
                                        />{" "}
                                        Rendre le texte obligatoire
                                    </label>
                                </>
                            )}

                            <div className="admin-edit-row">
                                <div className="admin-edit-field">
                                    <label htmlFor="create-product-weight">
                                        Poids
                                    </label>
                                    <input
                                        id="create-product-weight"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={createForm.weight}
                                        onChange={(event) =>
                                            setCreateForm({
                                                ...createForm,
                                                weight: event.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="admin-edit-field">
                                    <label htmlFor="create-product-height">
                                        Hauteur
                                    </label>
                                    <input
                                        id="create-product-height"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={createForm.height}
                                        onChange={(event) =>
                                            setCreateForm({
                                                ...createForm,
                                                height: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="admin-edit-row">
                                <div className="admin-edit-field">
                                    <label htmlFor="create-product-length">
                                        Longueur
                                    </label>
                                    <input
                                        id="create-product-length"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={createForm.length}
                                        onChange={(event) =>
                                            setCreateForm({
                                                ...createForm,
                                                length: event.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="admin-edit-field">
                                    <label htmlFor="create-product-width">
                                        Largeur
                                    </label>
                                    <input
                                        id="create-product-width"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={createForm.width}
                                        onChange={(event) =>
                                            setCreateForm({
                                                ...createForm,
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
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="admin-confirm-success"
                                onClick={handleCreateProduct}
                                disabled={createLoading}
                            >
                                {createLoading ? "Ajout en cours..." : "Ajouter"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALE DE MODIFICATION */}
            {productToEdit && (
                <div
                    className="admin-edit-overlay"
                    onClick={() => {
                        setProductToEdit(null);
                        setProductPictures([]);
                        setPictureFile(null);
                        setPictureAlt("");
                        setPictureIsMain(false);
                    }}
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
                                onClick={() => {
                                    setProductToEdit(null);
                                    setProductPictures([]);
                                    setPictureFile(null);
                                    setPictureAlt("");
                                    setPictureIsMain(false);
                                }}
                                aria-label="Fermer"
                            >
                                ×
                            </button>
                        </header>

                        <div className="admin-edit-form">
                            <div className="admin-edit-field">
                                <label htmlFor="edit-product-name">Nom</label>
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
                                        disabled={editForm.madeToOrder}
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

                            <label>
                                <input
                                    type="checkbox"
                                    checked={editForm.madeToOrder}
                                    onChange={(event) =>
                                        setEditForm({
                                            ...editForm,
                                            madeToOrder: event.target.checked,
                                        })
                                    }
                                />{" "}
                                Produit fabriqué à la commande (pas de stock à
                                gérer)
                            </label>

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
                                    <option value="" disabled>
                                        Choisir une catégorie
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
                            </div>

                            <div className="admin-edit-field">
                                <label htmlFor="edit-product-colors">
                                    Couleurs disponibles (séparées par des
                                    virgules)
                                </label>
                                <input
                                    id="edit-product-colors"
                                    type="text"
                                    placeholder="Rouge, Bleu, Vert"
                                    value={editForm.customizationColors}
                                    onChange={(event) =>
                                        setEditForm({
                                            ...editForm,
                                            customizationColors:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={editForm.customizationTextEnabled}
                                    onChange={(event) =>
                                        setEditForm({
                                            ...editForm,
                                            customizationTextEnabled:
                                                event.target.checked,
                                        })
                                    }
                                />{" "}
                                Autoriser un texte personnalisé
                            </label>

                            {editForm.customizationTextEnabled && (
                                <>
                                    <div className="admin-edit-field">
                                        <label htmlFor="edit-text-label">
                                            Libellé du champ texte
                                        </label>
                                        <input
                                            id="edit-text-label"
                                            type="text"
                                            value={
                                                editForm.customizationTextLabel
                                            }
                                            onChange={(event) =>
                                                setEditForm({
                                                    ...editForm,
                                                    customizationTextLabel:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="admin-edit-field">
                                        <label htmlFor="edit-text-max-length">
                                            Longueur maximale (1 à 200)
                                        </label>
                                        <input
                                            id="edit-text-max-length"
                                            type="number"
                                            min="1"
                                            max="200"
                                            step="1"
                                            value={
                                                editForm.customizationTextMaxLength
                                            }
                                            onChange={(event) =>
                                                setEditForm({
                                                    ...editForm,
                                                    customizationTextMaxLength:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="admin-edit-field">
                                        <label htmlFor="edit-text-placeholder">
                                            Texte indicatif
                                        </label>
                                        <input
                                            id="edit-text-placeholder"
                                            type="text"
                                            placeholder="Ex. : Indiquez le prénom"
                                            value={
                                                editForm.customizationTextPlaceholder
                                            }
                                            onChange={(event) =>
                                                setEditForm({
                                                    ...editForm,
                                                    customizationTextPlaceholder:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={
                                                editForm.customizationTextRequired
                                            }
                                            onChange={(event) =>
                                                setEditForm({
                                                    ...editForm,
                                                    customizationTextRequired:
                                                        event.target.checked,
                                                })
                                            }
                                        />{" "}
                                        Rendre le texte obligatoire
                                    </label>
                                </>
                            )}

                            <div className="admin-edit-images">
                                <h3>Images du produit</h3>

                                {picturesLoading ? (
                                    <p>Chargement des images...</p>
                                ) : productPictures.length === 0 ? (
                                    <p>Aucune image pour ce produit.</p>
                                ) : (
                                    <div className="admin-edit-images-grid">
                                        {productPictures.map((picture) => (
                                            <div
                                                key={picture.id}
                                                className="admin-edit-image-card"
                                            >
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${picture.url}`}
                                                    alt={picture.alt}
                                                />

                                                {picture.isMain && (
                                                    <span className="admin-edit-image-main">
                                                        Image principale
                                                    </span>
                                                )}

                                                <div className="admin-edit-image-actions">
                                                    {!picture.isMain && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSetMainPicture(
                                                                    picture
                                                                )
                                                            }
                                                            disabled={
                                                                pictureActionLoading ===
                                                                picture.id
                                                            }
                                                        >
                                                            {pictureActionLoading ===
                                                            picture.id
                                                                ? "Chargement..."
                                                                : "Définir principale"}
                                                        </button>
                                                    )}

                                                    {!picture.isMain && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeletePicture(
                                                                    picture
                                                                )
                                                            }
                                                            disabled={
                                                                pictureActionLoading ===
                                                                picture.id
                                                            }
                                                        >
                                                            Supprimer
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="admin-add-picture">
                                <h3>Ajouter une image</h3>

                                <div className="admin-edit-field">
                                    <label htmlFor="picture-file">Image</label>
                                    <input
                                        id="picture-file"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(event) => {
                                            const file =
                                                event.target.files?.[0] ?? null;
                                            setPictureFile(file);
                                        }}
                                    />
                                </div>

                                <div className="admin-edit-field">
                                    <label htmlFor="picture-alt">
                                        Texte alternatif
                                    </label>
                                    <input
                                        id="picture-alt"
                                        type="text"
                                        value={pictureAlt}
                                        placeholder="Description de l'image"
                                        onChange={(event) =>
                                            setPictureAlt(event.target.value)
                                        }
                                    />
                                </div>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={pictureIsMain}
                                        onChange={(event) =>
                                            setPictureIsMain(
                                                event.target.checked
                                            )
                                        }
                                    />{" "}
                                    Définir comme image principale
                                </label>

                                <button
                                    type="button"
                                    className="admin-confirm-success"
                                    onClick={handleUploadPicture}
                                    disabled={pictureUploadLoading}
                                >
                                    {pictureUploadLoading
                                        ? "Ajout en cours..."
                                        : "Ajouter l'image"}
                                </button>
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
                                onClick={() => {
                                    setProductToEdit(null);
                                    setProductPictures([]);
                                    setPictureFile(null);
                                    setPictureAlt("");
                                    setPictureIsMain(false);
                                }}
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="admin-confirm-success"
                                onClick={handleUpdateProduct}
                                disabled={actionLoading === productToEdit.id}
                            >
                                {actionLoading === productToEdit.id
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
