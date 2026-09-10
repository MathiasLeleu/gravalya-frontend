import './App.css'
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import AllProducts from './pages/AllProducts'
import Product from './pages/Product'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import Admin from './pages/Admin'
import NotFound from "./pages/NotFound";
import CGV from './pages/CGV'
import About from './pages/About'
import Privacy from './pages/Privacy'
import LegalNotice from './pages/LegalNotice'

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produits" element={<AllProducts />} />
                <Route path="/produits/:id" element={<Product />} />
                <Route path="/connexion" element={<Auth />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/commande" element={<Checkout />} />
                <Route path="/commande/confirmation" element={<OrderConfirmation />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/mes-commandes" element={<MyOrders />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/cgv" element={<CGV />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/confidentialite" element={<Privacy />} />
                <Route path="/mentions-legales" element={<LegalNotice />} />

                <Route path="*" element={<NotFound />} />  
            </Routes>

            <Footer />
        </>
    )
}

export default App