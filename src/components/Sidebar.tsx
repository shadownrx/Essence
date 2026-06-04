import { Shield, X } from 'lucide-react';
import SecureVault from './SecureVault';
import SettingsPanel, { Theme, HomeLink } from './SettingsPanel';

interface SidebarProps {
  isOpen: boolean;
  mode: 'vault' | 'settings';
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  userName: string;
  onUserNameChange: (value: string) => void;
  homeLinks: HomeLink[];
  onUpdateLinks: (links: HomeLink[]) => void;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  mode,
  theme,
  onThemeChange,
  userName,
  onUserNameChange,
  homeLinks,
  onUpdateLinks,
  onClose,
}: SidebarProps) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Shield size={18} color="var(--accent)" />
          {mode === 'settings' ? 'Ajustes' : 'Secure Vault'}
        </div>
        <button className="sidebar-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="sidebar-content">
        {mode === 'settings' ? (
          <SettingsPanel
            theme={theme}
            onThemeChange={onThemeChange}
            userName={userName}
            onUserNameChange={onUserNameChange}
            homeLinks={homeLinks}
            onUpdateLinks={onUpdateLinks}
          />
        ) : (
          <SecureVault />
        )}
      </div>
    </div>
  );
}
