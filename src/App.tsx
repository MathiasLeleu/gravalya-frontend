import './App.css'
import './index.css'
import { Routes, Route } from 'react-router-dom'

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
    return (
        <>
            <div className="app">
                <Header />
                <main className="app-content">

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/produits" element={<AllProducts />} />
                        <Route path="/produits/:id" element={<Product />} />
                        <Route path="/connexion" element={<Auth />} />
                        <Route path="/commande" element={<Checkout />} />

                        <Route element={<RequireAuth />}>
                            <Route path="/commande/confirmation" element={<OrderConfirmation />} />
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