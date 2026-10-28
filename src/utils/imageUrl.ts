const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

/**
 * Retourne une URL d'image exploitable par le navigateur.
 * - Les URL absolues (Cloudinary, etc.) restent inchangées.
 * - Les anciens chemins locaux sont préfixés par l'URL du backend.
 */
export const getImageUrl = (
    url: string | null | undefined
): string => {
    if (!url) {
        return "";
    }

    if (/^https?:\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }

    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};