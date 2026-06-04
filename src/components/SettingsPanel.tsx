import { useState } from 'react';
import { GripVertical, Palette, User, List, ArrowUpDown } from 'lucide-react';

export type Theme = 'cyan' | 'purple' | 'neon' | 'ultra';

export interface HomeLink {
  id: string;
  title: string;
  url: string;
  description: string;
}

interface SettingsPanelProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  userName: string;
  onUserNameChange: (value: string) => void;
  homeLinks: HomeLink[];
  onUpdateLinks: (links: HomeLink[]) => void;
}

export default function SettingsPanel({
  theme,
  onThemeChange,
  userName,
  onUserNameChange,
  homeLinks,
  onUpdateLinks,
}: SettingsPanelProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const nextLinks = [...homeLinks];
    const [moved] = nextLinks.splice(dragIndex, 1);
    nextLinks.splice(index, 0, moved);
    onUpdateLinks(nextLinks);
    setDragIndex(null);
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <div>
          <h2>Ajustes</h2>
          <p>Personaliza tu navegador y arrastra los accesos directos como quieras.</p>
        </div>
        <ArrowUpDown size={24} />
      </div>

      <div className="settings-section">
        <div className="settings-title">
          <User size={18} />
          Nombre del usuario
        </div>
        <input
          className="settings-input"
          type="text"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
          placeholder="Ingresa tu nombre"
        />
      </div>

      <div className="settings-section">
        <div className="settings-title">
          <Palette size={18} />
          Tema de interfaz
        </div>
        <div className="theme-chips">
          <button className={theme === 'cyan' ? 'active' : ''} onClick={() => onThemeChange('cyan')}>
            Cian
          </button>
          <button className={theme === 'purple' ? 'active' : ''} onClick={() => onThemeChange('purple')}>
            Púrpura
          </button>
          <button className={theme === 'neon' ? 'active' : ''} onClick={() => onThemeChange('neon')}>
            Neón
          </button>
          <button className={theme === 'ultra' ? 'active' : ''} onClick={() => onThemeChange('ultra')}>
            Ultra Black
          </button>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-title">
          <List size={18} />
          Reordenar accesos directos
        </div>
        <div className="drag-list">
          {homeLinks.map((link, index) => (
            <button
              key={link.id}
              className="drag-item"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              type="button"
            >
              <GripVertical size={18} />
              <div>
                <strong>{link.title}</strong>
                <span>{link.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
