import { useState, type FormEvent } from "react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGetLocation: () => void;
  isLoading: boolean;
}

/** Search input + location button */
const SearchBar = ({ onSearch, onGetLocation, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search city…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        🔍 Search
      </button>
      <button
        type="button"
        className="location-btn"
        onClick={onGetLocation}
        disabled={isLoading}
        title="Use current location"
      >
        📍
      </button>
    </form>
  );
};

export default SearchBar;
