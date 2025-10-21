import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { OSWindow, OSSettings } from '@/types/os';
import { useSound } from '@/hooks/useSound';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OSContextType {
  windows: OSWindow[];
  settings: OSSettings;
  openWindow: (app: string, title: string, icon: string, component: React.ComponentType<{ windowId: string }>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateSettings: (newSettings: Partial<OSSettings>) => void;
}

const OSContext = createContext<OSContextType | null>(null);

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within OSProvider');
  return context;
};

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<OSWindow[]>([]);
  const [settings, setSettings] = useState<OSSettings>({
    background_color: '#0a0a0a',
    background_image: null,
    font_family: 'Inter',
    font_size: 14,
    screen_zoom: 100,
    taskbar_position: 'bottom',
    hover_color: 'hsl(195 100% 50%)',
    theme: {
      border_color: 'hsl(240 5% 20%)',
      app_background: 'hsl(240 8% 8%)',
      text_color: 'hsl(210 40% 98%)',
    },
  });
  const { playSound } = useSound();
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('os_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data && !error) {
      setSettings({
        background_color: data.background_color,
        background_image: data.background_image,
        font_family: data.font_family,
        font_size: data.font_size,
        screen_zoom: data.screen_zoom,
        taskbar_position: data.taskbar_position as 'bottom' | 'left' | 'right',
        hover_color: data.hover_color || 'hsl(195 100% 50%)',
        theme: (data.theme as { border_color: string; app_background: string; text_color: string }) || {
          border_color: 'hsl(240 5% 20%)',
          app_background: 'hsl(240 8% 8%)',
          text_color: 'hsl(210 40% 98%)',
        },
      });
    }
  };

  const openWindow = useCallback((app: string, title: string, icon: string, component: React.ComponentType<{ windowId: string }>) => {
    playSound('open');
    const id = `${app}-${Date.now()}`;
    const newWindow: OSWindow = {
      id,
      app,
      title,
      icon,
      component,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 800, height: 600 },
      zIndex: windows.length + 1000,
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows, playSound]);

  const closeWindow = useCallback((id: string) => {
    playSound('close');
    setWindows(prev => prev.filter(w => w.id !== id));
  }, [playSound]);

  const minimizeWindow = useCallback((id: string) => {
    playSound('click');
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  }, [playSound]);

  const maximizeWindow = useCallback((id: string) => {
    playSound('click');
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  }, [playSound]);

  const focusWindow = useCallback((id: string) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex), 1000);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w));
  }, [windows]);

  const updateSettings = useCallback(async (newSettings: Partial<OSSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('os_settings')
      .upsert({ user_id: user.id, ...updated });

    if (error) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Settings saved" });
    }
  }, [settings, toast]);

  return (
    <OSContext.Provider value={{ windows, settings, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateSettings }}>
      {children}
    </OSContext.Provider>
  );
};
