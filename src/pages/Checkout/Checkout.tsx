import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./checkout.css";

import { useAuthStore } from "../../store";

import {
  getMe,
  getShippingMethods,
  getShippingRates,
  createOrder,
  getRelayPoints,
  getShippingOptions,
} from "../../api";

import type {
  IShippingMethod,
  IShippingRate,
  IRelayPoint,
  IShippingOption,
} from "../../@types";

const shippingServiceCodes: Record<string, string> = {
  "Colissimo-Domicile": "colissimo:home/fr",
  "Colissimo-Point relais": "colissimo:post-office",

  "Chronopost-Domicile": "chronopost:18",
  "Chronopost-Point relais": "chronopost:service_point",

  "Mondial Relay-Domicile":
    "mondial_relay:home_domestic,dualapi/c2c",
  "Mondial Relay-Point relais":
    "mondial_relay:service_point,dualapi/size=l,c2c",
};

export default function Checkout() {
  const cart = useAuthStore((state) => state.cart);

  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState(1);

  const [shippingMethods, setShippingMethods] = useState<IShippingMethod[]>([]);
  const [shippingRates, setShippingRates] = useState<IShippingRate[]>([]);
  const [shippingOptions, setShippingOptions] = useState<IShippingOption[]>([]);
  const [isRelayModalOpen, setIsRelayModalOpen] = useState(false);
  const [relayPoints, setRelayPoints] = useState<IRelayPoint[]>([]);
  const [selectedRelayPoint, setSelectedRelayPoint] =
    useState<IRelayPoint | null>(null);
  const [isRelayLoading, setIsRelayLoading] = useState(false);
  const [relayError, setRelayError] = useState("");

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const [shippingMethodsData, shippingRatesData] = await Promise.all([
          getShippingMethods(),
          getShippingRates(),
        ]);

        setShippingMethods(shippingMethodsData);
        setShippingRates(shippingRatesData);

        const token = useAuthStore.getState().token;

        if (token) {
          const userData = await getMe();

          setFormData((current) => ({
            ...current,
            firstName: userData.user.firstName,
            lastName: userData.user.lastName,
            email: userData.user.email,
          }));
        }
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

  const handleSearchRelayPoints = async () => {
    if (!formData.postalCode || !formData.city) {
      setRelayError("Veuillez renseigner votre code postal et votre ville.");
      return;
    }

    setIsRelayLoading(true);
    setRelayError("");
    setSelectedRelayPoint(null);

    try {
      const points = await getRelayPoints(
        shippingMethod,
        formData.postalCode,
        formData.city
      );

      setRelayPoints(points);

      if (points.length === 0) {
        setRelayError(
          "Aucun point relais disponible pour cette adresse."
        );
      }
    } catch (error) {
      console.error(error);
      setRelayPoints([]);
      setRelayError(
        "Impossible de récupérer les points relais."
      );
    } finally {
      setIsRelayLoading(false);
    }
  };

  
  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),

        customerEmail: formData.email,
        shippingMethodId: shippingMethod,
        shippingFirstName: formData.firstName,
        shippingLastName: formData.lastName,
        shippingCountry: formData.country,
        shippingAddress: formData.address,
        shippingAddress2: formData.address2 || undefined,
        shippingPostalCode: formData.postalCode,
        shippingCity: formData.city,
        shippingPhone: formData.phone,

        ...(selectedShippingMethod?.name !== "Lettre Suivie"
          ? {
              shippingOptionCode: selectedShippingOption?.code,
            }
          : {}),

        ...(isRelayDelivery && selectedRelayPoint
          ? {
              relayPoint: {
                relayPointId: selectedRelayPoint.relayPointId,
                relayPointName: selectedRelayPoint.relayPointName,
                relayPointAddress: selectedRelayPoint.relayPointAddress,
                relayPointPostalCode:
                  selectedRelayPoint.relayPointPostalCode,
                relayPointCity: selectedRelayPoint.relayPointCity,
                relayPointCountry: selectedRelayPoint.relayPointCountry,
              },
            }
          : {}),
      };

      const idempotencyKey =
        idempotencyKeyRef.current ?? crypto.randomUUID();

      idempotencyKeyRef.current = idempotencyKey;

      const order = await createOrder(payload, idempotencyKey);

      navigate("/commande/confirmation", {
        state: {
          orderNumber: order.orderNumber,
          amount: order.amount,
          shippingCost: order.shippingCost,
          shippingMethod: selectedShippingMethod,
          relayPoint: selectedRelayPoint,
        },
      });
    } catch (error) {
      console.error(
        "Erreur lors de la création de la commande :",
        error
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const cartSubtotal = cart.reduce(
    (total, item) =>
      total + Number(item.product.price) * item.quantity,
    0
  );

  const cartTotalWeight =
    Math.round(
      (
        cart.reduce(
          (total, item) =>
            total + Number(item.product.weight) * item.quantity,
          0
        ) / 1000
      ) * 1000
    ) / 1000;

  const selectedShippingRate = shippingRates.find(
    (rate) =>
      rate.shippingMethodId === shippingMethod &&
      cartTotalWeight >= Number(rate.minWeight) &&
      cartTotalWeight <= Number(rate.maxWeight)
  );

  useEffect(() => {
    if (
      !formData.postalCode ||
      !formData.city ||
      cartTotalWeight <= 0
    ) {
      setShippingOptions([]);
      return;
    }

    const sendcloudMethods = shippingMethods.filter(
      (method) => method.name !== "Lettre Suivie"
    );

    if (sendcloudMethods.length === 0) {
      setShippingOptions([]);
      return;
    }

    const loadShippingOptions = async () => {
      try {
        const options = await Promise.all(
          sendcloudMethods.map((method) =>
            getShippingOptions(
              method.id,
              formData.postalCode,
              formData.city,
              cartTotalWeight
            )
          )
        );

        setShippingOptions(options.flat());
      } catch (error) {
        console.error(
          "Erreur lors du chargement des options Sendcloud :",
          error
        );

        setShippingOptions([]);
      }
    };

    loadShippingOptions();
  }, [
    shippingMethods,
    formData.postalCode,
    formData.city,
    cartTotalWeight,
  ]);

  const selectedShippingMethod = shippingMethods.find(
    (method) => method.id === shippingMethod
  );

  const isRelayDelivery =
    selectedShippingMethod?.deliveryType === "Point relais";

  const selectedShippingOption = shippingOptions.find((option) => {
    if (!selectedShippingMethod) {
      return false;
    }

    const serviceKey =
      `${selectedShippingMethod.name}-${selectedShippingMethod.deliveryType}`;

    const serviceCode = shippingServiceCodes[serviceKey];

    return option.code === serviceCode;
  });

  const shippingCost =
    selectedShippingMethod?.name === "Lettre Suivie"
      ? selectedShippingRate
        ? Number(selectedShippingRate.cost)
        : 0
      : selectedShippingOption?.quotes?.[0]
        ? Number(
            selectedShippingOption.quotes[0].price.total.value
          )
        : 0;

  const cartTotal = cartSubtotal + shippingCost;

  return (
    <main className="checkout-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="checkout-page-header">
        <h1 className="main-title">
          Finaliser ma commande
        </h1>

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
                <strong>
                  {item.product.name}
                </strong>

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

              {[
                "Chronopost",
                "Colissimo",
                "Mondial Relay",
                "Lettre Suivie",
              ].map((shippingName) => {

                const methods = shippingMethods.filter((method) => {

                  if (method.name !== shippingName) {
                    return false;
                  }

                  if (method.name === "Lettre Suivie") {
                    return shippingRates.some(
                      (rate) =>
                        rate.shippingMethodId === method.id &&
                        cartTotalWeight >= Number(rate.minWeight) &&
                        cartTotalWeight <= Number(rate.maxWeight)
                    );
                  }

                  const serviceKey =
                    `${method.name}-${method.deliveryType}`;

                  const serviceCode =
                    shippingServiceCodes[serviceKey];

                  return shippingOptions.some(
                    (option) =>
                      option.code === serviceCode
                  );
                });

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
                            checked={
                              shippingMethod === method.id
                            }
                            onChange={(event) =>
                              setShippingMethod(
                                Number(event.target.value)
                              )
                            }
                          />

                          <span className="checkout-shipping-option-content">

                            <strong>
                              {method.deliveryType}
                            </strong>

                            <small>
                              {(() => {

                                if (
                                  method.name ===
                                  "Lettre Suivie"
                                ) {

                                  const rate =
                                    shippingRates.find(
                                      (rate) =>
                                        rate.shippingMethodId ===
                                          method.id &&
                                        cartTotalWeight >=
                                          Number(rate.minWeight) &&
                                        cartTotalWeight <=
                                          Number(rate.maxWeight)
                                    );

                                  return rate
                                    ? `${Number(rate.cost)
                                        .toFixed(2)
                                        .replace(".", ",")} €`
                                    : "Calcul...";
                                }

                                const serviceKey =
                                  `${method.name}-${method.deliveryType}`;

                                const serviceCode =
                                  shippingServiceCodes[
                                    serviceKey
                                  ];

                                const option =
                                  shippingOptions.find(
                                    (option) =>
                                      option.code ===
                                      serviceCode
                                  );

                                const quote =
                                  option?.quotes?.[0];

                                return quote
                                  ? `${Number(
                                      quote.price.total.value
                                    )
                                      .toFixed(2)
                                      .replace(".", ",")} €`
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

                  {selectedRelayPoint ? (
                    <div>

                      <strong>
                        {selectedRelayPoint.relayPointName}
                      </strong>

                      <p>
                        {selectedRelayPoint.relayPointAddress}
                        <br />

                        {selectedRelayPoint.relayPointPostalCode}{" "}
                        {selectedRelayPoint.relayPointCity}

                        <br />

                        {selectedRelayPoint.relayPointCountry}
                      </p>

                    </div>
                  ) : (
                    <div>

                      <strong>
                        Aucun point relais sélectionné
                      </strong>

                      <p>
                        Choisissez un point relais pour continuer.
                      </p>

                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsRelayModalOpen(true);
                      handleSearchRelayPoints();
                    }}
                  >
                    {selectedRelayPoint
                      ? "Modifier"
                      : "Choisir"}
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
                      onClick={() =>
                        setIsRelayModalOpen(false)
                      }
                    >
                      ×
                    </button>

                  </div>

                  <div className="checkout-relay-modal-content">

                    {isRelayLoading && (
                      <p>
                        Recherche des points relais...
                      </p>
                    )}

                    {!isRelayLoading && relayError && (
                      <p>
                        {relayError}
                      </p>
                    )}

                    {!isRelayLoading &&
                      !relayError &&
                      relayPoints.length > 0 && (
                        <div className="checkout-relay-points">

                          {relayPoints.map((point) => (
                            <button
                              type="button"
                              className="checkout-relay-point-option"
                              key={point.relayPointId}
                              onClick={() => {
                                setSelectedRelayPoint(point);
                                setIsRelayModalOpen(false);
                              }}
                            >

                              <div>

                                <strong>
                                  {point.relayPointName}
                                </strong>

                                <p>
                                  {point.relayPointAddress}
                                  <br />

                                  {point.relayPointPostalCode}{" "}
                                  {point.relayPointCity}
                                </p>

                              </div>

                              <span>
                                {point.distance !== null
                                  ? `${Math.round(
                                      point.distance
                                    )} m`
                                  : ""}
                              </span>

                            </button>
                          ))}

                        </div>
                      )}

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

                  <strong>
                    {item.product.name}
                  </strong>

                  <span>
                    {item.quantity} ×{" "}
                    {Number(item.product.price)
                      .toFixed(2)
                      .replace(".", ",")} €
                  </span>

                </div>

                <strong>
                  {(Number(item.product.price) *
                    item.quantity)
                    .toFixed(2)
                    .replace(".", ",")} €
                </strong>

              </div>
            ))}

          </div>

          <div className="checkout-summary-totals">

            <div className="checkout-summary-line">

              <span>
                Sous-total
              </span>

              <strong>
                {cartSubtotal.toFixed(2).replace(".", ",")} €
              </strong>

            </div>

            <div className="checkout-summary-line">

              <span>
                Livraison
              </span>

              <strong>
                {shippingCost.toFixed(2).replace(".", ",")} €
              </strong>

            </div>

            <div className="checkout-summary-total">

              <span>
                Total
              </span>

              <strong>
                {cartTotal.toFixed(2).replace(".", ",")} €
              </strong>

            </div>

          </div>

          <button
            type="button"
            className="checkout-submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Commande en cours..." : "Passer la commande"}
          </button>

        </aside>

      </div>

    </main>
  );
}