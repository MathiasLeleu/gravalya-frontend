import { Link } from "react-router-dom"

export default function AllProducts() {
    return (
        <main className="products-page">

            <header className="products-page-banner">
                
                <div className="products-page-banner-image"></div>

                <h1 className="page-main-title">
                    Gaming
                </h1>
            </header>

            <section className="products-page-content">
                <ul role="list">

                    <li className="products-page-product">
                        <Link to="/produits/produit-1">
                            <img
                                src="http://localhost:3000/uploads/products/decoration/maman/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-2">
                            <img
                                src="http://localhost:3000/uploads/products/portecle/papillon/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-3">
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-1">
                            <img
                                src="http://localhost:3000/uploads/products/decoration/maman/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-2">
                            <img
                                src="http://localhost:3000/uploads/products/portecle/papillon/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-3">
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-1">
                            <img
                                src="http://localhost:3000/uploads/products/decoration/maman/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-2">
                            <img
                                src="http://localhost:3000/uploads/products/portecle/papillon/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-3">
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-1">
                            <img
                                src="http://localhost:3000/uploads/products/decoration/maman/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-2">
                            <img
                                src="http://localhost:3000/uploads/products/portecle/papillon/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                    <li className="products-page-product">
                        <Link to="/produits/produit-3">
                            <img
                                src="http://localhost:3000/uploads/products/tableaubois/paysagejaponais/image1.jpg"
                                alt="Nom du produit"
                            />

                            <h2>Nom du produit</h2>
                        </Link>
                    </li>

                </ul>
            </section>

        </main>
    )
}