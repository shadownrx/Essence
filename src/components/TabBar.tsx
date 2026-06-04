import { Globe, Plus, X } from 'lucide-react';

export interface Tab {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
  history: string[];
  forwardHistory: string[];
}

interface TabBarProps {
  tabs: Tab[];
  onTabClick: (id: number) => void;
  onTabClose: (id: number) => void;
  onNewTab: () => void;
}

export default function TabBar({ tabs, onTabClick, onTabClose, onNewTab }: TabBarProps) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <div 
          key={tab.id} 
          className={`tab ${tab.isActive ? 'active' : ''}`}
          onClick={() => onTabClick(tab.id)}
        >
          <Globe className="tab-icon" />
          <span className="tab-title">{tab.title}</span>
          <div className="tab-close" onClick={(e) => {
            e.stopPropagation();
            onTabClose(tab.id);
          }}>
            <X size={14} />
          </div>
        </div>
      ))}
      <button className="new-tab-btn" title="Nueva Pestaña" onClick={onNewTab}>
        <Plus size={16} />
      </button>
    </div>
  );
}
