import { useEffect, useRef, useState, useCallback, FormEvent } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import './App.css';

import TabBar, { Tab } from './components/TabBar';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import BrowserHome from './components/BrowserHome';

export type Theme = 'cyan' | 'purple' | 'neon' | 'ultra';
export interface HomeLink {
  id: string;
  title: string;
  url: string;
  description: string;
}

const HOME_URL = 'about:blank';
let tabCounter = 2;

function App() {
  const [urlInput, setUrlInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'vault' | 'settings'>('vault');
  const [isNavBusy, setIsNavBusy] = useState(false);
  const [theme, setTheme] = useState<Theme>('ultra');
  const [isVibeMode, setIsVibeMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [homeLinks, setHomeLinks] = useState<HomeLink[]>([
    { id: 'google', title: 'Google', url: 'https://www.google.com', description: 'Buscar lo que necesitas.' },
    { id: 'github', title: 'GitHub', url: 'https://github.com', description: 'Explorar código y proyectos.' },
    { id: 'tauri', title: 'Tauri', url: 'https://tauri.app', description: 'Ver documentación y recursos.' },
    { id: 'youtube', title: 'YouTube', url: 'https://www.youtube.com', description: 'Ver videos e inspiración.' },
  ]);
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title: 'Inicio', url: HOME_URL, isActive: true, history: [], forwardHistory: [] },
  ]);

  const tabBarRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const activeTab = tabs.find((t) => t.isActive);

  const syncBounds = useCallback(async (sidebarOpen?: boolean, hide = false) => {
    const mainWindow = getCurrentWindow();
    const innerSize = await mainWindow.innerSize();
    const scaleFactor = await mainWindow.scaleFactor();

    const tabBarHeight = tabBarRef.current?.offsetHeight ?? 40;
    const toolbarHeight = toolbarRef.current?.offsetHeight ?? 52;
    const topOffset = tabBarHeight + toolbarHeight;
    const isOpen = sidebarOpen ?? isSidebarOpen;
    const sidebarWidth = isOpen ? 350 : 0;

    const width = hide ? 0 : (innerSize.width / scaleFactor) - sidebarWidth;
    const height = hide ? 0 : (innerSize.height / scaleFactor) - topOffset;

    await invoke('resize_browser', { x: 0, y: topOffset, width, height });
  }, [isSidebarOpen]);

  useEffect(() => {
    syncBounds(undefined, activeTab?.url === HOME_URL);
  }, [syncBounds, activeTab]);

  useEffect(() => {
    const mainWindow = getCurrentWindow();
    let unlisten: (() => void) | null = null;
    mainWindow.onResized(() => syncBounds(undefined, activeTab?.url === HOME_URL)).then(fn => { unlisten = fn; });
    return () => { unlisten?.(); };
  }, [syncBounds, activeTab]);

  useEffect(() => {
    const handleMenuClickOutside = (event: MouseEvent) => {
      if (!isMenuOpen) return;
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMenuClickOutside);
    return () => document.removeEventListener('mousedown', handleMenuClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    let unlisten: UnlistenFn | null = null;

    listen<string>('browser-url-changed', (event) => {
      setIsVibeMode(isYouTubePage(event.payload));
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  const normalizeUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return 'https://www.google.com';
    if (trimmed.includes(' ') || !trimmed.includes('.')) {
      return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return 'https://' + trimmed;
    }
    return trimmed;
  };

  const getTabTitle = (url: string) => {
    if (url === HOME_URL) return 'Inicio';
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const isAudioStreamingPage = (url: string) => {
    return /(?:youtube\.com\/watch|music\.youtube\.com|open\.spotify\.com|soundcloud\.com|bandcamp\.com)/i.test(url);
  };

  const isYouTubePage = (url: string) => {
    return /(?:youtube\.com|youtu\.be)/i.test(url);
  };

  const navigateToUrl = async (finalUrl: string, title?: string, recordHistory = true) => {
    const tabTitle = finalUrl === HOME_URL ? 'Inicio' : title ?? getTabTitle(finalUrl);
    setUrlInput(finalUrl === HOME_URL ? '' : finalUrl);
    setIsVibeMode(isYouTubePage(finalUrl));
    setTabs(prev => prev.map(t => {
      if (!t.isActive) return t;
      const updatedTab = {
        ...t,
        url: finalUrl,
        title: tabTitle,
      };

      if (!recordHistory || t.url === finalUrl) {
        return updatedTab;
      }

      return {
        ...updatedTab,
        history: [...t.history, t.url],
        forwardHistory: [],
      };
    }));
    await invoke('navigate_browser', { url: finalUrl });
  };

  const openLinkSafely = async (finalUrl: string) => {
    if (activeTab?.url && isAudioStreamingPage(activeTab.url) && finalUrl !== activeTab.url) {
      await invoke('open_external', { url: finalUrl });
      return;
    }

    await navigateToUrl(finalUrl);
  };

  const handleNavigate = async (e: FormEvent) => {
    e.preventDefault();
    const finalUrl = normalizeUrl(urlInput);
    await openLinkSafely(finalUrl);
  };

  const handleHome = async () => {
    await navigateToUrl(HOME_URL, 'Inicio');
  };

  const handleHomeSearch = async (query: string) => {
    const finalUrl = normalizeUrl(query);
    await openLinkSafely(finalUrl);
  };

  const isHomeActive = activeTab?.url === HOME_URL;

  const handleOpenSettings = () => {
    setSidebarMode('settings');
    setIsSidebarOpen(true);
  };

  const handleReload = async () => {
    if (!isHomeActive) {
      setIsNavBusy(true);
      try {
        await invoke('reload_browser');
      } finally {
        setIsNavBusy(false);
      }
    }
  };

  const handleBack = async () => {
    if (!isHomeActive && activeTab?.history.length) {
      setIsNavBusy(true);
      try {
        const previousUrl = activeTab.history[activeTab.history.length - 1];
        setTabs(prev => prev.map(t => {
          if (!t.isActive) return t;
          const nextHistory = t.history.slice(0, -1);
          return {
            ...t,
            history: nextHistory,
            forwardHistory: [...t.forwardHistory, t.url],
          };
        }));
        await navigateToUrl(previousUrl, undefined, false);
      } finally {
        setIsNavBusy(false);
      }
    }
  };

  const handleForward = async () => {
    if (!isHomeActive && activeTab?.forwardHistory.length) {
      setIsNavBusy(true);
      try {
        const nextUrl = activeTab.forwardHistory[activeTab.forwardHistory.length - 1];
        setTabs(prev => prev.map(t => {
          if (!t.isActive) return t;
          const nextForward = t.forwardHistory.slice(0, -1);
          return {
            ...t,
            history: [...t.history, t.url],
            forwardHistory: nextForward,
          };
        }));
        await navigateToUrl(nextUrl, undefined, false);
      } finally {
        setIsNavBusy(false);
      }
    }
  };

  const handleTabClick = async (id: number) => {
    const tab = tabs.find(t => t.id === id);
    if (!tab || tab.isActive) return;
    setTabs(prev => prev.map(t => ({ ...t, isActive: t.id === id })));
    setUrlInput(tab.url === HOME_URL ? '' : tab.url);
    if (tab.url !== HOME_URL) {
      await invoke('navigate_browser', { url: tab.url });
    }
  };

  const handleTabClose = (id: number) => {
    if (tabs.length === 1) return;
    const wasActive = tabs.find(t => t.id === id)?.isActive;
    const remaining = tabs.filter(t => t.id !== id);
    if (wasActive) {
      remaining[remaining.length - 1].isActive = true;
      const newActive = remaining[remaining.length - 1];
      setUrlInput(newActive.url === HOME_URL ? '' : newActive.url);
      if (newActive.url !== HOME_URL) {
        invoke('navigate_browser', { url: newActive.url });
      }
    }
    setTabs(remaining);
  };

  const handleNewTab = async () => {
    const newTab: Tab = {
      id: tabCounter++,
      title: 'Inicio',
      url: HOME_URL,
      isActive: true,
      history: [],
      forwardHistory: [],
    };
    setTabs(prev => [...prev.map(t => ({ ...t, isActive: false })), newTab]);
    setUrlInput('');
  };

  const handleToggleSidebar = (val: boolean) => {
    setIsSidebarOpen(val);
    syncBounds(val, activeTab?.url === HOME_URL);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenVault = () => {
    setSidebarMode('vault');
    handleToggleSidebar(true);
    handleCloseMenu();
  };

  useEffect(() => {
    setIsVibeMode(activeTab ? isYouTubePage(activeTab.url) : false);
  }, [activeTab]);

  return (
    <div className={`browser-app ${isVibeMode ? 'vibe-mode' : ''}`}>
      <div ref={tabBarRef}>
        <TabBar
          tabs={tabs}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onNewTab={handleNewTab}
        />
      </div>
      <div ref={toolbarRef}>
        <Toolbar
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          currentPage={activeTab?.title ?? 'Essence'}
          onNavigate={handleNavigate}
          onHome={handleHome}
          onReload={handleReload}
          onBack={handleBack}
          onForward={handleForward}
          canGoBack={!isHomeActive && !!activeTab?.history.length && !isNavBusy}
          canGoForward={!isHomeActive && !!activeTab?.forwardHistory.length && !isNavBusy}
          canReload={!isHomeActive && !isNavBusy}
          isNavBusy={isNavBusy}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => handleToggleSidebar(!isSidebarOpen)}
          isMenuOpen={isMenuOpen}
          onMenuToggle={handleToggleMenu}
          onMenuClose={handleCloseMenu}
          onOpenVault={handleOpenVault}
          onOpenSettings={handleOpenSettings}
          onNewTab={handleNewTab}          isVibeMode={isVibeMode}        />
      </div>
      <div className="workspace">
        {activeTab?.url === HOME_URL && (
          <BrowserHome
            theme={theme}
            userName={userName}
            homeLinks={homeLinks}
            onSearch={handleHomeSearch}
            onQuickNavigate={(url) => openLinkSafely(url)}
          />
        )}
        <Sidebar
          isOpen={isSidebarOpen}
          mode={sidebarMode}
          theme={theme}
          onThemeChange={setTheme}
          userName={userName}
          onUserNameChange={setUserName}
          homeLinks={homeLinks}
          onUpdateLinks={setHomeLinks}
          onClose={() => handleToggleSidebar(false)}
        />
      </div>
    </div>
  );
}

export default App;