import { useEffect, useState } from "react";

import {getCategories, createCategory, updateCategory, deleteCategory} from "../../api";

import type { ICategory } from "../../@types";

import "./admin-categories.css";

export default function AdminCategories() {

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    const [editName, setEditName] = useState("");
    const [editSlug, setEditSlug] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editBannerFile, setEditBannerFile] = useState<File | null>(null);

    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState("");

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoading(true);
                setError("");

                const data = await getCategories();

                setCategories(data);

            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de récupérer les catégories."
                );
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);

    const filteredCategories = categories.filter((category) =>
        category.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleCreateCategory = async () => {

        setCreateError("");

        if (!imageFile || !bannerFile) {
            setCreateError(
                "L'image et la bannière de la catégorie sont requises."
            );
            return;
        }

        try {
            setCreating(true);

            const newCategory = await createCategory({
                name,
                slug,
                description,
                image: imageFile,
                banner: bannerFile,
            });

            setCategories((currentCategories) => [
                ...currentCategories,
                newCategory,
            ]);

            setName("");
            setSlug("");
            setDescription("");
            setImageFile(null);
            setBannerFile(null);

            setShowCreateForm(false);

        } catch (error) {
            setCreateError(
                error instanceof Error
                    ? error.message
                    : "Impossible de créer la catégorie."
            );
        } finally {
            setCreating(false);
        }
    };

    const handleEditCategory = (category: ICategory) => {

        setEditingCategory(category);

        setEditName(category.name);
        setEditSlug(category.slug);
        setEditDescription(category.description);

        setEditImageFile(null);
        setEditBannerFile(null);

        setUpdateError("");
    };

    const handleUpdateCategory = async () => {

        if (!editingCategory) {
            return;
        }

        setUpdateError("");

        try {
            setUpdating(true);

            const updatedCategory = await updateCategory(
                editingCategory.id,
                {
                    name: editName,
                    slug: editSlug,
                    description: editDescription,
                    image: editImageFile ?? undefined,
                    banner: editBannerFile ?? undefined,
                }
            );

            setCategories((currentCategories) =>
                currentCategories.map((category) =>
                    category.id === updatedCategory.id
                        ? updatedCategory
                        : category
                )
            );

            setEditingCategory(null);

            setEditName("");
            setEditSlug("");
            setEditDescription("");
            setEditImageFile(null);
            setEditBannerFile(null);

        } catch (error) {
            setUpdateError(
                error instanceof Error
                    ? error.message
                    : "Impossible de modifier la catégorie."
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            setError("");

            await deleteCategory(categoryId);

            setCategories((currentCategories) =>
                currentCategories.filter(
                    (category) => category.id !== categoryId
                )
            );

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Impossible de supprimer la catégorie."
            );
        }
    };

    return (
        <section className="admin-categories-page">

            <header className="admin-section-header">
                <h1 className="main-title">
                    Catégories
                </h1>

                <p>
                    Gérez les catégories de Gravelya Studio.
                </p>
            </header>

            <div className="admin-categories-actions">

                <div className="admin-categories-filters">

                    <input
                        type="search"
                        placeholder="Rechercher une catégorie..."
                        aria-label="Rechercher une catégorie"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                </div>

                <button
                    className="admin-add-button"
                    onClick={() => {
                        setShowCreateForm(true);
                        setCreateError("");
                    }}
                >
                    + Ajouter une catégorie
                </button>

            </div>

            {showCreateForm && (
                <div className="admin-category-form">

                    <h2>Ajouter une catégorie</h2>

                    {createError && (
                        <p className="admin-category-form-error">
                            {createError}
                        </p>
                    )}

                    <div className="admin-category-form-field">
                        <label htmlFor="category-name">
                            Nom
                        </label>

                        <input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-category-form-field">
                        <label htmlFor="category-slug">
                            Slug
                        </label>

                        <input
                            id="category-slug"
                            type="text"
                            value={slug}
                            onChange={(event) => setSlug(event.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-category-form-field">
                        <label htmlFor="category-description">
                            Description
                        </label>

                        <textarea
                            id="category-description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-category-form-field">
                        <label htmlFor="category-image">
                            Image
                        </label>

                        <input
                            id="category-image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                setImageFile(file);
                            }}
                            required
                        />
                    </div>

                    <div className="admin-category-form-field">
                        <label htmlFor="category-banner">
                            Bannière
                        </label>

                        <input
                            id="category-banner"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                setBannerFile(file);
                            }}
                            required
                        />
                    </div>

                    <div className="admin-category-form-actions">

                        <button
                            type="button"
                            onClick={() => setShowCreateForm(false)}
                        >
                            Annuler
                        </button>

                        <button
                            type="button"
                            onClick={handleCreateCategory}
                            disabled={creating}
                        >
                            {creating ? "Création..." : "Créer"}
                        </button>

                    </div>

                </div>
            )}

            {editingCategory && (
                <div className="admin-category-form">

                    <h2>Modifier une catégorie</h2>

                    {updateError && (
                        <p className="admin-category-form-error">
                            {updateError}
                        </p>
                    )}

                    <div className="admin-category-form-field">
                        <label htmlFor="edit-category-name">
                            Nom
                        </label>

                        <input
                            id="edit-category-name"
                            type="text"
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                        />
                    </div>

                    <div className="admin-category-form-field">
                        <label htmlFor="edit-category-slug">
                            Slug
                        </label>

                        <input
                            id="edit-category-slug"
                            type="text"
                            value={editSlug}
                            onChange={(event) => setEditSlug(event.target.value)}
                        />
                    </div>

                    <div className="admin-category-form-field">
                        <label htmlFor="edit-category-description">
                            Description
                        </label>

                        <textarea
                            id="edit-category-description"
                            value={editDescription}
                            onChange={(event) => setEditDescription(event.target.value)}
                        />
                    </div>

                    <div className="admin-category-form-field">
                        <label htmlFor="edit-category-image">
                            Nouvelle image
                        </label>

                        <input
                            id="edit-category-image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                setEditImageFile(file);
                            }}
                        />
                    </div>

                    <div className="admin-category-form-field">
                        <label htmlFor="edit-category-banner">
                            Nouvelle bannière
                        </label>

                        <input
                            id="edit-category-banner"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                setEditBannerFile(file);
                            }}
                        />
                    </div>

                    <div className="admin-category-form-actions">

                        <button
                            type="button"
                            onClick={() => {
                                setEditingCategory(null);
                                setUpdateError("");
                            }}
                        >
                            Annuler
                        </button>

                        <button
                            type="button"
                            onClick={handleUpdateCategory}
                            disabled={updating}
                        >
                            {updating ? "Modification..." : "Modifier"}
                        </button>

                    </div>

                </div>
            )}

            {loading && (
                <p>
                    Chargement des catégories...
                </p>
            )}

            {!loading && error && (
                <p>
                    {error}
                </p>
            )}

            {!loading && !error && (
                <div className="admin-categories-list">

                    {filteredCategories.length === 0 ? (

                        <p>
                            Aucune catégorie trouvée.
                        </p>

                    ) : (

                        filteredCategories.map((category) => {

                            const productCount =
                                category.products?.length ?? 0;

                            return (
                                <article
                                    className="admin-category-card"
                                    key={category.id}
                                >

                                    <div className="admin-category-image">

                                        {category.imageUrl ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}${category.imageUrl}`}
                                                alt={category.name}
                                            />
                                        ) : (
                                            <span>
                                                Image
                                            </span>
                                        )}

                                    </div>

                                    <div className="admin-category-info">

                                        <h2>
                                            {category.name}
                                        </h2>

                                        <p>
                                            {category.description}
                                        </p>

                                        <span className="admin-category-products">
                                            {productCount}{" "}
                                            {productCount === 1
                                                ? "produit"
                                                : "produits"}
                                        </span>

                                    </div>

                                    <div className="admin-category-actions">

                                        <button
                                            className="admin-edit-button"
                                            onClick={() => handleEditCategory(category)}
                                        >
                                            Modifier
                                        </button>

                                        <button
                                            className="admin-delete-button"
                                            onClick={() => handleDeleteCategory(category.id)}
                                        >
                                            Supprimer
                                        </button>

                                    </div>

                                </article>
                            );
                        })

                    )}

                </div>
            )}

        </section>
    );
}