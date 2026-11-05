import './App.css'
import './index.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AUTH_SESSION_EXPIRED_EVENT } from './api'

import RequireAuth from './components/ProtectedRoute/RequireAuth'
import RequireAdmin from './components/ProtectedRoute/RequireAdmin'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

import Home from './pages/Home/Home'
import AllProducts from './pages/AllProducts/AllProducts'
import Product from './pages/Product/Product'
import Auth from './pages/Auth/Auth'
import Checkout from './pages/Checkout/Checkout'
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation'
import Profile from './pages/Profile/Profile'
import MyOrders from './pages/MyOrders/MyOrders'
import Admin from './pages/Admin/Admin'
import NotFound from "./pages/NotFound/NotFound";
import CGV from './pages/CGV/CGV'
import About from './pages/About/About'
import Privacy from './pages/Privacy/Privacy'
import LegalNotice from './pages/LegalNotice/LegalNotice'

function App() {

    const navigate = useNavigate()
    const [showLoginSuccess, setShowLoginSuccess] = useState(false)

    useEffect(() => {
        const handleSessionExpired = () => {
            navigate('/connexion', {
                replace: true,
            });
        };

        window.addEventListener(
            AUTH_SESSION_EXPIRED_EVENT,
            handleSessionExpired
        )

        return () => {
            window.removeEventListener(
                AUTH_SESSION_EXPIRED_EVENT,
                handleSessionExpired
            )
        }
    }, [navigate])

    useEffect(() => {
        const handleLoginSuccess = () => {
            setShowLoginSuccess(true)
        }

        window.addEventListener('auth:login-success', handleLoginSuccess)

        return () => {
            window.removeEventListener('auth:login-success', handleLoginSuccess)
        }
    }, [])

    useEffect(() => {
        if (!showLoginSuccess) return

        const timeout = window.setTimeout(() => {
            setShowLoginSuccess(false)
        }, 10000)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [showLoginSuccess])

    return (
        <>
            <div className="app">
                <Header />
                {showLoginSuccess && (
                    <div className="app-toast app-toast-success" role="status">
                        <div className="app-toast-content">
                            <strong>Connexion réussie</strong>
                            <p>Vous êtes maintenant connecté à votre compte. Bonne visite sur Gravelya Studio !</p>
                        </div>

                        <button
                            type="button"
                            className="app-toast-close"
                            onClick={() => setShowLoginSuccess(false)}
                            aria-label="Fermer la notification"
                        >
                            ×
                        </button>
                    </div>
                )}
                <main className="app-content">

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/produits" element={<AllProducts />} />
                        <Route path="/produits/categorie/:slug" element={<AllProducts />} />
                        <Route path="/produits/:id" element={<Product />} />
                        <Route path="/connexion" element={<Auth />} />
                        <Route path="/commande" element={<Checkout />} />
                        <Route path="/commande/confirmation" element={<OrderConfirmation />} />

                        <Route element={<RequireAuth />}>
                            <Route path="/profil" element={<Profile />} />
                            <Route path="/mes-commandes" element={<MyOrders />} />
                        </Route>

                        <Route element={<RequireAdmin />}>
                            <Route path="/admin" element={<Admin />} />
                        </Route>
                        
                        <Route path="/cgv" element={<CGV />} />
                        <Route path="/a-propos" element={<About />} />
                        <Route path="/politique-de-confidentialite" element={<Privacy />} />
                        <Route path="/mentions-legales" element={<LegalNotice />} />

                        <Route path="*" element={<NotFound />} />  
                    </Routes>

                </main>

                <Footer />
            </div>
        </>
    )
}

export default App