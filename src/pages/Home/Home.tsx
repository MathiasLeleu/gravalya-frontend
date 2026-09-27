import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import SearchSortBar, { filterAndSort, type SortValue } from "../../components/SearchSortBar/SearchSortBar"
import "./home.css"

import { getCategories } from "../../api"
import type { ICategory } from "../../@types"
 
export default function Home() {
    const [search, setSearch] = useState<string>("")
    const [sort, setSort] = useState<SortValue>("default")
    const [categories, setCategories] = useState<ICategory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getCategories()
                setCategories(data)
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de récupérer les catégories."
                )
            } finally {
                setIsLoading(false)
            }
        }

        loadCategories()
    }, [])
 
    const visibleCategories = useMemo(
        () => filterAndSort(categories, search, sort),
        [categories, search, sort]
    )
    return (
        <main className="home-page">

            <header className="home-page-presentation">
                <h1 className="main-title">
                    Bienvenue chez Gravelya Studio
                </h1>

                {/* <img src="..." alt="..." /> */}

                <h3 className="low-title">Vos idées, nos créations</h3>
                <p className="default-text">Gravure, impression 3D et sublimation — donnons vie à vos idées avec des créations uniques, personnalisées ou prêtes à offrir.</p>

                <h3 className="low-title">✂️ Découpe & Gravure Laser</h3>
                <p className="default-text">Bois, inox, acrylique. Personnalisé ou non.</p>

                <h3 className="low-title">🖨️ Impression 3D</h3>
                <p className="default-text">Porte-clés, décorations, plaques de porte. Personnalisé ou non.</p>

                <h3 className="low-title">🎨 Sublimation</h3>
                <p className="default-text">Textile, badges, coques, stickers. Personnalisé ou non.</p>

                <Link to="/produits" className="home-page-button">
                    Découvrir nos créations
                </Link>

                <p className="default-text">Une idée sur-mesure ? Contactez-nous</p>

            </header>

            <section className="home-page-categories">
                <h2 className="sub-title">Nos catégories</h2>
 
                <SearchSortBar
                    search={search}
                    onSearchChange={setSearch}
                    sort={sort}
                    onSortChange={setSort}
                    placeholder="Rechercher une catégorie…"
                />
 
                {isLoading ? (
                    <p role="status">Chargement des catégories...</p>
                ) : error ? (
                    <p role="alert">{error}</p>
                ) : visibleCategories.length === 0 ? (
                    <p className="no-results" role="status">
                        Aucune catégorie ne correspond à « {search} ».
                    </p>
                ) : (
                    <ul role="list">
                        {visibleCategories.map((category) => (
                            <li key={category.id} className="home-page-category">
                                <Link to={`/produits/categorie/${category.slug}`}>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${category.imageUrl}`}
                                        alt={category.name}
                                    />
                                    <h3 className="low-title">{category.name}</h3>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

            </section>

        </main>
    )
}