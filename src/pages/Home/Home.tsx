import { Link } from "react-router-dom"
import "./home.css"

export default function Home() {
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

                <ul role="list">
                    <li className="home-page-category">
                        <a href="/produits/categorie-1">
                            <img
                                src="http://localhost:3000/uploads/categories/audio/audio.png"
                                alt=""
                            />
                            <h3 className="low-title">Nom de la catégorie</h3>
                        </a>
                    </li>

                    <li className="home-page-category">
                        <a href="/produits/categorie-2">
                            <img
                                src="http://localhost:3000/uploads/categories/gaming/gaming.png"
                                alt=""
                            />
                            <h3 className="low-title">Nom de la catégorieNom de la catégorieNom de la catégorie</h3>
                        </a>
                    </li>

                    <li className="home-page-category">
                        <a href="/produits/categorie-3">
                            <img
                                src="http://localhost:3000/uploads/categories/informatique/informatique.png"
                                alt=""
                            />
                            <h3 className="low-title">Nom de la catégorie</h3>
                        </a>
                    </li>

                    <li className="home-page-category">
                        <a href="/produits/categorie-1">
                            <img
                                src="http://localhost:3000/uploads/categories/audio/audio.png"
                                alt=""
                            />
                            <h3 className="low-title">Nom de la catégorie</h3>
                        </a>
                    </li>

                    <li className="home-page-category">
                        <a href="/produits/categorie-2">
                            <img
                                src="http://localhost:3000/uploads/categories/gaming/gaming.png"
                                alt=""
                            />
                            <h3 className="low-title">Nom de la catégorie</h3>
                        </a>
                    </li>

                    <li className="home-page-category">
                        <a href="/produits/categorie-3">
                            <img
                                src="http://localhost:3000/uploads/categories/informatique/informatique.png"
                                alt=""
                            />
                            <h3 className="low-title">Nom de la catégorie</h3>
                        </a>
                    </li>
                </ul>
            </section>

        </main>
    )
}