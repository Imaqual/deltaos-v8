export interface OSWindow {
  id: string;
  app: string;
  title: string;
  icon: string;
  component: React.ComponentType<{ windowId: string }>;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface OSSettings {
  id?: string;
  user_id?: string;
  background_color: string;
  background_image: string | null;
  font_family: string;
  font_size: number;
  screen_zoom: number;
  taskbar_position: 'bottom' | 'left' | 'right';
}

export const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Pacific/Auckland',
].sort();
