import "./searchsortbar.css";
import { SORT_OPTIONS, type SortValue, type SortOption } from "./SearchSortUtils.ts";

interface SearchSortBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    sort: SortValue;
    onSortChange: (value: SortValue) => void;
    sortOptions?: SortOption[];
    placeholder?: string;
}

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