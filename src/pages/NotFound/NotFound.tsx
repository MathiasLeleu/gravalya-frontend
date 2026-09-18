import image404Desktop from "../../assets/404desktop.png";
import image404Tablet from "../../assets/404tablette.png";
import image404Mobile from "../../assets/404mobile.png";

import "./notfound.css"

export default function NotFound() {
    return (
        <main className="not-found-page">
            <picture>
                <source
                    media="(max-width: 767px)"
                    srcSet={image404Mobile}
                />

                <source
                    media="(max-width: 1199px)"
                    srcSet={image404Tablet}
                />

                <img
                    src={image404Desktop}
                    alt="Page introuvable"
                    className="not-found-image"
                />
            </picture>

            <button
                className="not-found-button"
                onClick={() => window.location.href = "/"}
            >
                Retour à l'accueil
            </button>
        </main>
    );
}