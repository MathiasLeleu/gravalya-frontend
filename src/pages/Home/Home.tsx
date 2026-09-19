import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import SearchSortBar, { filterAndSort, type SortValue } from "../../components/SearchSortBar/SearchSortBar"
import "./home.css"
 
interface Category {
    id: number
    slug: string
    name: string
    image: string
}
 
// À remplacer par tes vraies catégories (API)
const CATEGORIES: Category[] = [
    {
        id: 1,
        slug: "categorie-1",
        name: "Audio",
        image: "http://localhost:3000/uploads/categories/audio/audio.png",
    },
    {
        id: 2,
        slug: "categorie-2",
        name: "Gaming",
        image: "http://localhost:3000/uploads/categories/gaming/gaming.png",
    },
    {
        id: 3,
        slug: "categorie-3",
        name: "Informatique",
        image: "http://localhost:3000/uploads/categories/informatique/informatique.png",
    },
    {
        id: 4,
        slug: "categorie-1",
        name: "Audio",
        image: "http://localhost:3000/uploads/categories/audio/audio.png",
    },
    {
        id: 5,
        slug: "categorie-2",
        name: "Gaming",
        image: "http://localhost:3000/uploads/categories/gaming/gaming.png",
    },
    {
        id: 6,
        slug: "categorie-3",
        name: "Informatique",
        image: "http://localhost:3000/uploads/categories/informatique/informatique.png",
    },
    {
        id: 7,
        slug: "categorie-1",
        name: "Audio",
        image: "http://localhost:3000/uploads/categories/audio/audio.png",
    },
    {
        id: 8,
        slug: "categorie-2",
        name: "Gaming",
        image: "http://localhost:3000/uploads/categories/gaming/gaming.png",
    },
    {
        id: 9,
        slug: "categorie-3",
        name: "Informatique",
        image: "http://localhost:3000/uploads/categories/informatique/informatique.png",
    },
]
 
export default function Home() {
    const [search, setSearch] = useState<string>("")
    const [sort, setSort] = useState<SortValue>("default")
 
    const visibleCategories = useMemo(
        () => filterAndSort(CATEGORIES, search, sort),
        [search, sort]
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
 
                {visibleCategories.length === 0 ? (
                    <p className="no-results" role="status">
                        Aucune catégorie ne correspond à « {search} ».
                    </p>
                ) : (
                    <ul role="list">
                        {visibleCategories.map((category) => (
                            <li key={category.id} className="home-page-category">
                                <Link to={`/produits/${category.slug}`}>
                                    <img src={category.image} alt="" />
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