import { useOS } from '@/contexts/OSContext';
import { useSound } from '@/hooks/useSound';
import { useState, useEffect } from 'react';
import { Settings, MessageSquare, Gamepad2, Globe, Sparkles, Calculator, FileText, Folder, LogOut } from 'lucide-react';
import SettingsApp from './apps/SettingsApp';
import GamesApp from './apps/GamesApp';
import BrowserApp from './apps/BrowserApp';
import AIApp from './apps/AIApp';
import ChatApp from './apps/ChatApp';
import CalculatorApp from './apps/CalculatorApp';
import NotesApp from './apps/NotesApp';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const apps = [
  { id: 'settings', name: 'Settings', icon: Settings, component: SettingsApp },
  { id: 'chat', name: 'Chat', icon: MessageSquare, component: ChatApp },
  { id: 'ai', name: 'Delta AI', icon: Sparkles, component: AIApp },
  { id: 'games', name: 'Games', icon: Gamepad2, component: GamesApp },
  { id: 'browser', name: 'Browser', icon: Globe, component: BrowserApp },
  { id: 'calculator', name: 'Calculator', icon: Calculator, component: CalculatorApp },
  { id: 'notes', name: 'Notes', icon: FileText, component: NotesApp },
];

const Taskbar = () => {
  const { openWindow, windows, minimizeWindow, focusWindow, settings } = useOS();
  const { playSound } = useSound();
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (app: typeof apps[0]) => {
    playSound('click');
    openWindow(app.id, app.name, app.icon.name, app.component);
  };

  const handleWindowClick = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (window?.isMinimized) {
      minimizeWindow(windowId);
      focusWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const taskbarClasses = {
    bottom: 'bottom-0 left-0 right-0 h-12 flex-row',
    left: 'left-0 top-0 bottom-0 w-16 flex-col',
    right: 'right-0 top-0 bottom-0 w-16 flex-col',
  };

  return (
    <div
      className={`fixed bg-card/95 backdrop-blur-sm border-border flex items-center gap-2 px-3 z-[9999] ${
        taskbarClasses[settings.taskbar_position]
      } ${settings.taskbar_position === 'bottom' ? 'border-t' : settings.taskbar_position === 'left' ? 'border-r' : 'border-l'}`}
    >
      {/* App Launcher */}
      <div className="flex gap-2">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => handleAppClick(app)}
            onMouseEnter={() => playSound('hover')}
            className="p-2 hover:bg-accent rounded-lg transition-colors group relative"
            title={app.name}
          >
            <app.icon className="h-5 w-5" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Open Windows */}
      {windows.length > 0 && (
        <div className="flex gap-1 ml-4">
          {windows.map((window) => (
            <button
              key={window.id}
              onClick={() => handleWindowClick(window.id)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                window.isMinimized ? 'bg-muted' : 'bg-primary text-primary-foreground'
              }`}
            >
              {window.title}
            </button>
          ))}
        </div>
      )}

      {/* Right Side - Clock & Logout */}
      <div className="ml-auto flex items-center gap-3">
        <div className="text-sm font-medium">
          <div>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-xs text-muted-foreground">
            {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <button
          onClick={handleLogout}
          onMouseEnter={() => playSound('hover')}
          className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Taskbar;
