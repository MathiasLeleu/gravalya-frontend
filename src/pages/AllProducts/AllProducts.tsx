import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import "./allproducts.css"

import { getProducts } from "../../api"
import type { IProduct } from "../../@types"

export default function AllProducts() {

    const [products, setProducts] = useState<IProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts()
                setProducts(data)
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de récupérer les produits."
                )
            } finally {
                setIsLoading(false)
            }
        }

        loadProducts()
    }, [])

    return (
        <main className="products-page">

            <header className="products-page-banner">

                <div className="products-page-banner-image"></div>

                <h1 className="page-main-title main-title">
                    Gaming
                </h1>
            </header>

            <section className="products-page-content">

                {isLoading ? (
                    <p role="status">Chargement des produits...</p>
                ) : error ? (
                    <p role="alert">{error}</p>
                ) : products.length === 0 ? (
                    <p className="no-results" role="status">
                        Aucun produit disponible.
                    </p>
                ) : (
                    <ul role="list">
                        {products.map((product) => (
                            <li key={product.id} className="products-page-product">
                                <Link to={`/produits/${product.id}`}>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${product.pictures[0].url}`}
                                        alt={product.pictures[0].alt}
                                    />

                                    <h3 className="low-title">
                                        {product.name}
                                    </h3>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

            </section>

        </main>
    )
}