import { useOS } from '@/contexts/OSContext';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';

const Desktop = () => {
  const { settings } = useOS();

  return (
    <div
      className="fixed inset-0 overflow-hidden transition-all duration-300 gradient-windows"
      style={{
        fontSize: `${settings.font_size}px`,
        zoom: `${settings.screen_zoom}%`,
      }}
    >
      {/* Animated wave blobs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/10 wave-blob animate-wave" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-white/15 wave-blob animate-wave" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-white/10 wave-blob animate-wave" style={{ animationDelay: '10s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-[450px] h-[450px] bg-white/8 wave-blob animate-wave" style={{ animationDelay: '15s' }} />
      </div>

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
