import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MAX_QUERY_LENGTH = 80;

export function HeaderSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = query.trim().slice(0, MAX_QUERY_LENGTH);
    if (!value) return;
    navigate(`/vehicles?search=${encodeURIComponent(value)}`);
    close();
  };

  if (!open) {
    return (
      <button
        type="button"
        className="header-icon-btn"
        onClick={() => setOpen(true)}
        aria-label="Rechercher"
      >
        <Search aria-hidden="true" />
      </button>
    );
  }

  return (
    <form className="header-search" onSubmit={handleSubmit}>
      <Search className="header-search__icon" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => event.key === 'Escape' && close()}
        maxLength={MAX_QUERY_LENGTH}
        placeholder="Rechercher un véhicule..."
        className="header-search__input"
        aria-label="Rechercher un véhicule"
        // biome-ignore lint/a11y/noAutofocus: le champ s'ouvre à la demande de l'utilisateur
        autoFocus
      />
      <button type="button" className="header-search__close" onClick={close} aria-label="Fermer">
        <X aria-hidden="true" />
      </button>
    </form>
  );
}
