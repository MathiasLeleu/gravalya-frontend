import "./searchsortbar.css"

export type SortValue = "default" | "az" | "za"

export interface SortOption {
    value: SortValue
    label: string
}

interface SearchSortBarProps {
    search: string
    onSearchChange: (value: string) => void
    sort: SortValue
    onSortChange: (value: SortValue) => void
    sortOptions?: SortOption[]
    placeholder?: string
}

// Retire les accents et met en minuscules : "Éléphant" -> "elephant"
export function normalize(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
}

// Filtre par nom puis trie selon l'option choisie
export function filterAndSort<T extends { name: string }>(
    items: T[],
    search: string,
    sort: SortValue
): T[] {
    const query = normalize(search)

    const filtered = query
        ? items.filter((item) => normalize(item.name).includes(query))
        : [...items]

    switch (sort) {
        case "az":
            return filtered.sort((a, b) => a.name.localeCompare(b.name, "fr"))
        case "za":
            return filtered.sort((a, b) => b.name.localeCompare(a.name, "fr"))
        default:
            return filtered // ordre d'origine
    }
}

export const SORT_OPTIONS: SortOption[] = [
    { value: "default", label: "Par défaut" },
    { value: "az", label: "Ordre alphabétique (A → Z)" },
    { value: "za", label: "Ordre alphabétique inverse (Z → A)" },
]

export default function SearchSortBar({
    search,
    onSearchChange,
    sort,
    onSortChange,
    sortOptions = SORT_OPTIONS,
    placeholder = "Rechercher…",
}: SearchSortBarProps) {
    return (
        <div className="search-sort-bar">
            <div className="search-sort-field search-sort-search">
                <label htmlFor="search-input">Rechercher</label>
                <input
                    id="search-input"
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="off"
                />
            </div>

            <div className="search-sort-field search-sort-select">
                <label htmlFor="sort-select">Trier par</label>
                <select
                    id="sort-select"
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value as SortValue)}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}