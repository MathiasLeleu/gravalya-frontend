import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./checkout.css";

import { useAuthStore } from "../../store";

import { getMe, getShippingMethods, getShippingRates, createOrder } from "../../api";
import type { IShippingMethod, IShippingRate } from "../../@types";

export default function Checkout() {
  const cart = useAuthStore((state) => state.cart);

  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState(1);

  const [shippingMethods, setShippingMethods] = useState<IShippingMethod[]>([]);
  const [shippingRates, setShippingRates] = useState<IShippingRate[]>([]);
  const [isRelayModalOpen, setIsRelayModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "France",
  });

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const [userData, shippingMethodsData, shippingRatesData] = await Promise.all([
          getMe(),
          getShippingMethods(),
          getShippingRates(),
        ]);

        setFormData((current) => ({
          ...current,
          firstName: userData.user.firstName,
          lastName: userData.user.lastName,
          email: userData.user.email,
        }));

        setShippingMethods(shippingMethodsData);
        setShippingRates(shippingRatesData);
      } catch (error) {
        console.error(error);
      }
    };

    loadCheckoutData();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsRelayModalOpen(false);
      }
    };

    if (isRelayModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isRelayModalOpen]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingMethodId: shippingMethod,
        shippingFirstName: formData.firstName,
        shippingLastName: formData.lastName,
        shippingCountry: formData.country,
        shippingAddress: formData.address,
        shippingAddress2: formData.address2 || undefined,
        shippingPostalCode: formData.postalCode,
        shippingCity: formData.city,
        shippingPhone: formData.phone,
      };

      const order = await createOrder(payload);

      navigate("/commande/confirmation", {
        state: {
          orderNumber: order.orderNumber,
          amount: order.amount,
          shippingCost: order.shippingCost,
          shippingMethod: selectedShippingMethod,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);
    }
  };

  const cartSubtotal = cart.reduce(
    (total, item) =>
      total + Number(item.product.price) * item.quantity,
    0
  );

  const cartTotalWeight =
    Math.round(
      cart.reduce(
        (total, item) =>
          total + Number(item.product.weight) * item.quantity,
        0
      ) * 1000
    ) / 1000;

  const selectedShippingRate = shippingRates.find(
    (rate) =>
      rate.shippingMethodId === shippingMethod &&
      cartTotalWeight >= Number(rate.minWeight) &&
      cartTotalWeight <= Number(rate.maxWeight)
  );

  useEffect(() => {
    const selectedMethodAvailable = shippingRates.some(
        (rate) =>
            rate.shippingMethodId === shippingMethod &&
            cartTotalWeight >= Number(rate.minWeight) &&
            cartTotalWeight <= Number(rate.maxWeight)
    );

    if (!selectedMethodAvailable) {
        const firstAvailableMethod = shippingMethods.find((method) =>
            shippingRates.some(
                (rate) =>
                    rate.shippingMethodId === method.id &&
                    cartTotalWeight >= Number(rate.minWeight) &&
                    cartTotalWeight <= Number(rate.maxWeight)
            )
        );

        if (firstAvailableMethod) {
            setShippingMethod(firstAvailableMethod.id);
        }
    }
  }, [shippingRates, shippingMethods, shippingMethod, cartTotalWeight]);

  const shippingCost = selectedShippingRate
    ? Number(selectedShippingRate.cost)
    : 0;

  const cartTotal = cartSubtotal + shippingCost;

  const selectedShippingMethod = shippingMethods.find(
    (method) => method.id === shippingMethod
  );

  const isRelayDelivery =
    selectedShippingMethod?.deliveryType === "Point relais";

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
                    value={formData.firstName}
                    onChange={handleChange}
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
                    value={formData.lastName}
                    onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.phone}
                  onChange={handleChange}
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
                  value={formData.address}
                  onChange={handleChange}
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
                  value={formData.address2}
                  onChange={handleChange}
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
                    value={formData.postalCode}
                    onChange={handleChange}
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
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="checkout-form-field">
                <label htmlFor="country">
                  Pays *
                </label>

                <input
                  type="text"
                  id="country"
                  name="country"
                  value="France"
                  readOnly
                />
              </div>

            </div>

          </div>

          {/* MODE DE LIVRAISON */}

          <div className="checkout-section">

            <h2 className="sub-title">
              Mode de livraison
            </h2>

            <div className="checkout-shipping-methods">

              {["Chronopost", "Colissimo", "Mondial Relay", "Lettre Suivie"].map((shippingName) => {

                const methods = shippingMethods.filter(
                  (method) => method.name === shippingName &&
                    shippingRates.some(
                      (rate) =>
                          rate.shippingMethodId === method.id &&
                          cartTotalWeight >= Number(rate.minWeight) &&
                          cartTotalWeight <= Number(rate.maxWeight)
                    )
                );

                if (methods.length === 0) {
                  return null;
                }

                return (
                  <div
                    className="checkout-shipping-group"
                    key={shippingName}
                  >

                    <h3 className="low-title">
                      {shippingName}
                    </h3>

                    <div className="checkout-shipping-options-row">

                      {methods.map((method) => (
                        <label
                          className="checkout-shipping-option"
                          key={method.id}
                        >

                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={shippingMethod === method.id}
                            onChange={(event) =>
                              setShippingMethod(Number(event.target.value))
                            }
                          />

                          <span className="checkout-shipping-option-content">
                            <strong>{method.deliveryType}</strong>
                            <small>
                              {(() => {
                                const rate = shippingRates.find(
                                  (rate) =>
                                    rate.shippingMethodId === method.id &&
                                    cartTotalWeight >= Number(rate.minWeight) &&
                                    cartTotalWeight <= Number(rate.maxWeight)
                                );

                                return rate
                                  ? `${Number(rate.cost).toFixed(2).replace(".", ",")} €`
                                  : "Calcul...";
                              })()}
                            </small>
                          </span>

                        </label>
                      ))}

                    </div>

                  </div>
                );
              })}

            </div>

            {isRelayDelivery && (
              <div className="checkout-relay-point">
                <h3 className="low-title">
                  Point relais
                </h3>

                <div className="checkout-relay-point-card">
                  <div>
                    <strong>Point relais - Pouldergat</strong>

                    <p>
                      12 rue Exemple
                      <br />
                      29100 Pouldergat
                      <br />
                      France
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRelayModalOpen(true)}
                  >
                    Modifier
                  </button>
                </div>
              </div>
            )}

            {isRelayModalOpen && (
              <div className="checkout-relay-modal-overlay">
                <div className="checkout-relay-modal">

                  <div className="checkout-relay-modal-header">
                    <h2 className="sub-title">
                      Choisir un point relais
                    </h2>

                    <button
                      type="button"
                      onClick={() => setIsRelayModalOpen(false)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="checkout-relay-modal-content">
                    <p>
                      La sélection des points relais sera connectée à l'API dédiée.
                    </p>
                  </div>

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
            onClick={handleSubmit}
          >
            Passer la commande
          </button>

        </aside>

      </div>

    </main>
  );
}