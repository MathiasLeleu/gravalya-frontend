import { Link } from "react-router-dom"

export default function Home() {
    return (
        <main className="home-page">

            <header className="home-page-presentation">
                <h1 className="page-main-title">
                    Bienvenue chez Gravelya Studio
                </h1>

                {/* <img src="..." alt="..." /> */}

                <h3>Vos idées, nos créations</h3>
                <p>Gravure, impression 3D et sublimation — donnons vie à vos idées avec des créations uniques, personnalisées ou prêtes à offrir.</p>
                <h3>✂️ Découpe & Gravure Laser</h3>
                <p>Bois, inox, acrylique. Personnalisé ou non.</p>
                <h3>🖨️ Impression 3D</h3>
                <p>Porte-clés, décorations, plaques de porte. Personnalisé ou non.</p>
                <h3>🎨 Sublimation</h3>
                <p>Textile, badges, coques, stickers. Personnalisé ou non.</p>

                <Link to="/produits" className="home-page-button">
                    Découvrir nos créations
                </Link>

                <p>Une idée sur-mesure ? Contactez-nous</p>

            </header>

            <section className="home-page-categories">
                <h2>Nos catégories</h2>

                <ul role="list">
                    <li className="home-page-category">
                        <a href="/produits/categorie-1">
                            <img src="http://localhost:3000/uploads/categories/audio/audio.png" alt="" />
                            <h3>Nom de la catégorie</h3>
                        </a>
                    </li>

                    <li className="home-page-category">
                        <a href="/produits/categorie-2">
                            <img src="http://localhost:3000/uploads/categories/gaming/gaming.png" alt="" />
                            <h3>Nom de la catégorie</h3>
                        </a>
                    </li>

                    <li className="home-page-category">
                        <a href="/produits/categorie-3">
                            <img src="http://localhost:3000/uploads/categories/informatique/informatique.png" alt="" />
                            <h3>Nom de la catégorie</h3>
                        </a>
                    </li>
                </ul>
            </section>

        </main>
    )
}