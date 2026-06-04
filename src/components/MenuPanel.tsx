import { Settings, Home, Plus, RefreshCw, Shield } from 'lucide-react';

interface MenuPanelProps {
  isOpen: boolean;
  isSidebarOpen: boolean;
  onClose: () => void;
  onNewTab: () => void;
  onOpenVault: () => void;
  onOpenSettings: () => void;
  onHome: () => void;
  onReload: () => void;
}

export default function MenuPanel({ isOpen, isSidebarOpen, onClose, onNewTab, onOpenVault, onOpenSettings, onHome, onReload }: MenuPanelProps) {
  const handleClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className={`menu-panel ${isOpen ? 'open' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className="menu-panel-header">Menú rápido</div>
      <button className="menu-item" onClick={() => handleClick(onNewTab)}>
        <Plus size={16} />
        <span>Nueva pestaña</span>
      </button>
      <button className="menu-item" onClick={() => handleClick(onOpenVault)}>
        <Shield size={16} />
        <span>Abrir caja fuerte</span>
      </button>
      <button className="menu-item" onClick={() => handleClick(onOpenSettings)}>
        <Settings size={16} />
        <span>Abrir ajustes</span>
      </button>
      <button className="menu-item" onClick={() => handleClick(onHome)}>
        <Home size={16} />
        <span>Ir a inicio</span>
      </button>
      <button className="menu-item" onClick={() => handleClick(onReload)}>
        <RefreshCw size={16} />
        <span>Recargar</span>
      </button>
    </div>
  );
}
