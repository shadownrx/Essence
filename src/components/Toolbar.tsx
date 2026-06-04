import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Star, Shield, Menu, Settings } from 'lucide-react';
import MenuPanel from './MenuPanel';

interface ToolbarProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  currentPage: string;
  onNavigate: (e: React.FormEvent) => void;
  onHome: () => void;
  onReload: () => void;
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  canReload: boolean;
  isNavBusy: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onOpenVault: () => void;
  onOpenSettings: () => void;
  onNewTab: () => void;
}

export default function Toolbar({
  urlInput,
  setUrlInput,
  currentPage,
  onNavigate,
  onHome,
  onReload,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
  canReload,
  isNavBusy,
  isSidebarOpen,
  toggleSidebar,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onOpenVault,
  onOpenSettings,
  onNewTab,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <div className="brand-chip">Essence</div>
        <div className="brand-label">{currentPage}</div>
      </div>
      <button className="nav-btn" title="Atrás" onClick={onBack} disabled={!canGoBack}>
        <ArrowLeft size={18} />
      </button>
      <button className="nav-btn" title="Adelante" onClick={onForward} disabled={!canGoForward}>
        <ArrowRight size={18} />
      </button>
      <button className="nav-btn" title="Recargar" onClick={onReload} disabled={!canReload}>
        <RotateCw size={18} />
      </button>
      <button className="nav-btn" onClick={onHome} title="Inicio" disabled={isNavBusy}>
        <Home size={18} />
      </button>

      <form className="address-bar" onSubmit={onNavigate}>
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          className="address-input"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Buscar en la web o escribir URL"
        />
        <span title="A�adir a Marcadores" style={{ cursor: 'pointer', display: 'flex' }}>
          <Star size={16} color="var(--text-muted)" />
        </span>
      </form>

      <button className="nav-btn" title="Caja Fuerte" onClick={toggleSidebar}>
        <Shield size={18} color={isSidebarOpen ? 'var(--accent)' : 'currentColor'} />
      </button>
      <button className="nav-btn" title="Ajustes" onClick={onOpenSettings}>
        <Settings size={18} />
      </button>
      <button
        className={`nav-btn ${isMenuOpen ? 'active' : ''}`}
        title="Menú"
        aria-expanded={isMenuOpen}
        onClick={onMenuToggle}
      >
        <Menu size={18} />
      </button>
      <MenuPanel
        isOpen={isMenuOpen}
        isSidebarOpen={isSidebarOpen}
        onClose={onMenuClose}
        onNewTab={onNewTab}
        onOpenVault={onOpenVault}
        onOpenSettings={onOpenSettings}
        onHome={onHome}
        onReload={onReload}
      />
    </div>
  );
}
