import { FormEvent, useState } from 'react';
import { Search, Sparkles, ShieldCheck, Globe2, Star, Compass, Bookmark } from 'lucide-react';
import { HomeLink, Theme } from './SettingsPanel';

interface BrowserHomeProps {
  theme: Theme;
  userName: string;
  homeLinks: HomeLink[];
  onSearch: (query: string) => void;
  onQuickNavigate: (url: string) => void;
}

export default function BrowserHome({ theme, userName, homeLinks, onSearch, onQuickNavigate }: BrowserHomeProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  const greeting = userName ? `Hola, ${userName}` : 'Hola, navegante';

  const renderIcon = (id: string) => {
    switch (id) {
      case 'google':
        return <Globe2 size={20} />;
      case 'github':
        return <Star size={20} />;
      case 'tauri':
        return <Compass size={20} />;
      case 'youtube':
        return <Bookmark size={20} />;
      default:
        return <ShieldCheck size={20} />;
    }
  };

  return (
    <div className={`browser-home theme-${theme}`}>
      <div className="home-glow" />
      <div className="home-card">
        <div className="home-header">
          <div>
            <div className="home-badge">ESSENCE</div>
            <h1>{greeting}</h1>
            <p>Tu navegador personal con accesos directos y apariencia inteligente.</p>
          </div>
          <div className="home-chip-group">
            <span>Modo Pulse</span>
            <span>Privacidad</span>
            <span>Multi-tarea</span>
          </div>
        </div>

        <div className="home-actions">
          <button type="button" className="home-action" onClick={() => onQuickNavigate('https://www.google.com')}>
            Buscar ideas
          </button>
          <button type="button" className="home-action" onClick={() => onQuickNavigate('https://github.com')}>
            Explorar código
          </button>
          <button type="button" className="home-action" onClick={() => onQuickNavigate('https://tauri.app')}>
            Ver docs Tauri
          </button>
        </div>

        <form className="home-search" onSubmit={handleSubmit}>
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar o escribir una dirección"
          />
          <button type="submit">Ir</button>
        </form>

        <div className="home-grid">
          {homeLinks.map((link) => (
            <button key={link.id} className="home-tile" onClick={() => onQuickNavigate(link.url)}>
              {renderIcon(link.id)}
              <div>
                <strong>{link.title}</strong>
                <span>{link.description}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="home-notes">
          <div>
            <Sparkles size={16} /> Diseño óptimo
          </div>
          <div>
            <ShieldCheck size={16} /> Privacidad activada
          </div>
        </div>
      </div>
    </div>
  );
}
