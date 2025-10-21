import { useOS } from '@/contexts/OSContext';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';

const Desktop = () => {
  const { settings } = useOS();

  return (
    <div
      className="fixed inset-0 overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: settings.background_color,
        backgroundImage: settings.background_image ? `url(${settings.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontSize: `${settings.font_size}px`,
        zoom: `${settings.screen_zoom}%`,
      }}
    >
      {/* Desktop Area */}
      <div className="absolute inset-0">
        <WindowManager />
      </div>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};

export default Desktop;
