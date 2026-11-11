export type SortValue = "default" | "az" | "za";

export interface SortOption {
    value: SortValue;
    label: string;
}

export function normalize(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export function filterAndSort<T extends { name: string }>(
    items: T[],
    search: string,
    sort: SortValue
): T[] {
    const query = normalize(search);

    const filtered = query
        ? items.filter((item) => normalize(item.name).includes(query))
        : [...items];

    switch (sort) {
        case "az":
            return filtered.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        case "za":
            return filtered.sort((a, b) => b.name.localeCompare(a.name, "fr"));
        default:
            return filtered;
    }
}

export const SORT_OPTIONS: SortOption[] = [
    { value: "default", label: "Par défaut" },
    { value: "az", label: "Ordre alphabétique (A → Z)" },
    { value: "za", label: "Ordre alphabétique inverse (Z → A)" },
];
