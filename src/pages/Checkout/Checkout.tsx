import { useState, useEffect } from "react";
import "./checkout.css";

import { useAuthStore } from "../../store";

import { getMe } from "../../api";

export default function Checkout() {
  const cart = useAuthStore((state) => state.cart);
  const [shippingMethod, setShippingMethod] = useState(
    "chronopost-domicile"
  );

  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    loadUser();
  }, []);

  const cartSubtotal = cart.reduce(
    (total, item) =>
      total + Number(item.product.price) * item.quantity,
    0
  );

  const shippingPrices: Record<string, number> = {
  "chronopost-domicile": 3.50,
  "chronopost-relais": 6.50,
  "colissimo-domicile": 5.90,
  "colissimo-relais": 5.50,
  "mondial-relay-domicile": 6.90,
  "mondial-relay-relais": 4.90,
};

const shippingCost = shippingPrices[shippingMethod];
const cartTotal = cartSubtotal + shippingCost;

  const isRelayDelivery =
    shippingMethod === "chronopost-relais" ||
    shippingMethod === "colissimo-relais" ||
    shippingMethod === "mondial-relay-relais";

  return (
    <main className="checkout-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="checkout-page-header">
        <h1 className="main-title">Finaliser ma commande</h1>

        <p className="checkout-page-introduction">
          Vérifiez vos informations avant de commander.
        </p>
      </header>


      {/* ========================================
          RÉCAPITULATIF MOBILE / TABLETTE
      ======================================== */}

      <details className="checkout-mobile-summary">

        <summary>
          <span>Votre commande</span>
          <strong>
            {cartTotal.toFixed(2).replace(".", ",")} €
          </strong>
        </summary>

        <div className="checkout-mobile-summary-content">

          {cart.map((item) => (
            <div
              key={item.product.id}
              className="checkout-mobile-summary-product"
            >
              <div>
                <strong>{item.product.name}</strong>

                <span>
                  {item.quantity} ×{" "}
                  {Number(item.product.price)
                    .toFixed(2)
                    .replace(".", ",")} €
                </span>
              </div>

              <strong>
                {(Number(item.product.price) * item.quantity)
                  .toFixed(2)
                  .replace(".", ",")} €
              </strong>
            </div>
          ))}

          <div className="checkout-mobile-summary-totals">

            <div className="checkout-mobile-summary-line">
              <span>Sous-total</span>
              <strong>
                {cartSubtotal.toFixed(2).replace(".", ",")} €
              </strong>
            </div>

            <div className="checkout-mobile-summary-line">
              <span>Livraison</span>
              <strong>
                {shippingCost.toFixed(2).replace(".", ",")} €
              </strong>
            </div>

            <div className="checkout-mobile-summary-total">
              <span>Total</span>
              <strong>
                {cartTotal.toFixed(2).replace(".", ",")} €
              </strong>
            </div>

          </div>

        </div>

      </details>


      {/* ========================================
          CONTENU
      ======================================== */}

      <div className="checkout-content">

        {/* ======================================
            FORMULAIRE
        ====================================== */}

        <section className="checkout-form-section">

          {/* INFORMATIONS PERSONNELLES */}

          <div className="checkout-section">

            <h2 className="sub-title">
              Informations personnelles
            </h2>

            <div className="checkout-form">

              <div className="checkout-form-row">

                <div className="checkout-form-field">
                  <label htmlFor="firstName">
                    Prénom *
                  </label>

                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={user?.firstName ?? ""}
                  />
                </div>

                <div className="checkout-form-field">
                  <label htmlFor="lastName">
                    Nom *
                  </label>

                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    defaultValue={user?.lastName ?? ""}
                  />
                </div>

              </div>

              <div className="checkout-form-field">
                <label htmlFor="email">
                  Email *
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user?.email ?? ""}
                />
              </div>

              <div className="checkout-form-field">
                <label htmlFor="phone">
                  Téléphone *
                </label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue="06 12 34 56 78"
                />
              </div>

            </div>

          </div>


          {/* ADRESSE DE LIVRAISON */}

          <div className="checkout-section">

            <h2 className="sub-title">
              Adresse de livraison
            </h2>

            <div className="checkout-form">

              <div className="checkout-form-field">
                <label htmlFor="address">
                  Adresse *
                </label>

                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue="12 rue de la République"
                />
              </div>

              <div className="checkout-form-field">
                <label htmlFor="address2">
                  Complément d'adresse
                </label>

                <input
                  type="text"
                  id="address2"
                  name="address2"
                  defaultValue="Appartement 2"
                />
              </div>

              <div className="checkout-form-row">

                <div className="checkout-form-field">
                  <label htmlFor="postalCode">
                    Code postal *
                  </label>

                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    defaultValue="29100"
                  />
                </div>

                <div className="checkout-form-field">
                  <label htmlFor="city">
                    Ville *
                  </label>

                  <input
                    type="text"
                    id="city"
                    name="city"
                    defaultValue="Pouldergat"
                  />
                </div>

              </div>

              <div className="checkout-form-field">
                <label htmlFor="country">
                  Pays *
                </label>

                <select
                  id="country"
                  name="country"
                  defaultValue="France"
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Luxembourg">Luxembourg</option>
                </select>
              </div>

            </div>

          </div>


          {/* MODE DE LIVRAISON */}

          <div className="checkout-section">

            <h2 className="sub-title">
              Mode de livraison
            </h2>

            <div className="checkout-shipping-methods">

              {/* CHRONOPOST */}

              <div className="checkout-shipping-group">

                <h3 className="low-title">
                  Chronopost
                </h3>

                <div className="checkout-shipping-options-row">

                    <label className="checkout-shipping-option">

                    <input
                        type="radio"
                        name="shippingMethod"
                        value="chronopost-domicile"
                        checked={
                        shippingMethod === "chronopost-domicile"
                        }
                        onChange={(event) =>
                        setShippingMethod(event.target.value)
                        }
                    />

                    <span className="checkout-shipping-option-content">
                        <strong>Domicile</strong>
                        <small>3,50 €</small>
                    </span>

                    </label>

                    <label className="checkout-shipping-option">

                    <input
                        type="radio"
                        name="shippingMethod"
                        value="chronopost-relais"
                        checked={
                        shippingMethod === "chronopost-relais"
                        }
                        onChange={(event) =>
                        setShippingMethod(event.target.value)
                        }
                    />

                    <span className="checkout-shipping-option-content">
                        <strong>Point relais</strong>
                        <small>6,50 €</small>
                    </span>

                    </label>
                
                </div>

              </div>


              {/* COLISSIMO */}

              <div className="checkout-shipping-group">

                <h3 className="low-title">
                  Colissimo
                </h3>

                <div className="checkout-shipping-options-row">

                  <label className="checkout-shipping-option">

                    <input
                      type="radio"
                      name="shippingMethod"
                      value="colissimo-domicile"
                      checked={
                        shippingMethod === "colissimo-domicile"
                      }
                      onChange={(event) =>
                        setShippingMethod(event.target.value)
                      }
                    />

                    <span className="checkout-shipping-option-content">
                      <strong>Domicile</strong>
                      <small>5,90 €</small>
                    </span>

                  </label>

                  <label className="checkout-shipping-option">

                    <input
                      type="radio"
                      name="shippingMethod"
                      value="colissimo-relais"
                      checked={
                        shippingMethod === "colissimo-relais"
                      }
                      onChange={(event) =>
                        setShippingMethod(event.target.value)
                      }
                    />

                    <span className="checkout-shipping-option-content">
                      <strong>Point relais</strong>
                      <small>5,50 €</small>
                    </span>

                  </label>

                </div>

              </div>


              {/* MONDIAL RELAY */}

              <div className="checkout-shipping-group">

                <h3 className="low-title">
                  Mondial Relay
                </h3>

                <div className="checkout-shipping-options-row">

                  <label className="checkout-shipping-option">

                    <input
                      type="radio"
                      name="shippingMethod"
                      value="mondial-relay-domicile"
                      checked={
                        shippingMethod === "mondial-relay-domicile"
                      }
                      onChange={(event) =>
                        setShippingMethod(event.target.value)
                      }
                    />

                    <span className="checkout-shipping-option-content">
                      <strong>Domicile</strong>
                      <small>6,90 €</small>
                    </span>

                  </label>

                  <label className="checkout-shipping-option">

                    <input
                      type="radio"
                      name="shippingMethod"
                      value="mondial-relay-relais"
                      checked={
                        shippingMethod === "mondial-relay-relais"
                      }
                      onChange={(event) =>
                        setShippingMethod(event.target.value)
                      }
                    />

                    <span className="checkout-shipping-option-content">
                      <strong>Point relais</strong>
                      <small>4,90 €</small>
                    </span>

                  </label>

                </div>

              </div>

            </div>


            {/* POINT RELAIS */}

            {isRelayDelivery && (
              <div className="checkout-relay-point">

                <h3 className="low-title">
                  Point relais
                </h3>

                <div className="checkout-relay-point-card">

                  <div>
                    <strong>
                      Point relais - Pouldergat
                    </strong>

                    <address>
                      12 rue Exemple
                      <br />
                      29100 Pouldergat
                      <br />
                      France
                    </address>
                  </div>

                  <button
                    type="button"
                    className="checkout-relay-point-button"
                  >
                    Modifier
                  </button>

                </div>

              </div>
            )}

          </div>


          {/* PAIEMENT */}

          <div className="checkout-section">

            <h2 className="sub-title">
              Paiement
            </h2>

            <div className="checkout-payment">

              <h3 className="low-title">
                Carte bancaire
              </h3>

              <div className="checkout-form">

                <div className="checkout-form-field">
                  <label htmlFor="cardNumber">
                    Numéro de carte *
                  </label>

                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                  />
                </div>

                <div className="checkout-form-row">

                  <div className="checkout-form-field">
                    <label htmlFor="cardExpiry">
                      Date d'expiration *
                    </label>

                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      placeholder="MM / AA"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="checkout-form-field">
                    <label htmlFor="cardCvc">
                      CVC *
                    </label>

                    <input
                      type="text"
                      id="cardCvc"
                      name="cardCvc"
                      placeholder="123"
                      inputMode="numeric"
                    />
                  </div>

                </div>

              </div>

              <p className="checkout-payment-security">
                Paiement sécurisé par carte bancaire.
              </p>

            </div>

          </div>

        </section>


        {/* ======================================
            RÉCAPITULATIF PRINCIPAL
        ====================================== */}

        <aside className="checkout-summary">

          <h2 className="sub-title">
            Récapitulatif
          </h2>

          <div className="checkout-summary-products">

            {cart.map((item) => (
              <div
                key={item.product.id}
                className="checkout-summary-product"
              >
                <div>
                  <strong>{item.product.name}</strong>

                  <span>
                    {item.quantity} ×{" "}
                    {Number(item.product.price)
                      .toFixed(2)
                      .replace(".", ",")} €
                  </span>
                </div>

                <strong>
                  {(Number(item.product.price) * item.quantity)
                    .toFixed(2)
                    .replace(".", ",")} €
                </strong>
              </div>
            ))}

          </div>

          <div className="checkout-summary-totals">

            <div className="checkout-summary-line">
              <span>Sous-total</span>
              <strong>
                {cartSubtotal.toFixed(2).replace(".", ",")} €
              </strong>
            </div>

            <div className="checkout-summary-line">
              <span>Livraison</span>
              <strong>
                {shippingCost.toFixed(2).replace(".", ",")} €
              </strong>
            </div>

            <div className="checkout-summary-total">
              <span>Total</span>
              <strong>
                {cartTotal.toFixed(2).replace(".", ",")} €
              </strong>
            </div>

          </div>

          <button
            type="button"
            className="checkout-submit-button"
          >
            Passer la commande
          </button>

        </aside>

      </div>

    </main>
  );
}