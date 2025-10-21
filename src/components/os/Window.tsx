import { useOS } from '@/contexts/OSContext';
import { OSWindow } from '@/types/os';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface WindowProps {
  window: OSWindow;
}

const Window = ({ window }: WindowProps) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useOS();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const Component = window.component;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    focusWindow(window.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || window.isMaximized) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      if (windowRef.current) {
        windowRef.current.style.left = `${Math.max(0, newX)}px`;
        windowRef.current.style.top = `${Math.max(0, newY)}px`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.isMaximized]);

  if (window.isMinimized) return null;

  const style = window.isMaximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 48px)' }
    : {
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        width: `${window.size.width}px`,
        height: `${window.size.height}px`,
      };

  return (
    <div
      ref={windowRef}
      className="fixed bg-card border border-border rounded-lg shadow-2xl overflow-hidden pointer-events-auto animate-scale-in"
      style={{
        ...style,
        zIndex: window.zIndex,
      }}
      onClick={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-muted/50 border-b border-border flex items-center justify-between px-3 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{window.title}</span>
        </div>
        
        <div className="window-controls flex gap-2">
          <button
            onClick={() => closeWindow(window.id)}
            className="w-3 h-3 rounded-full bg-destructive hover:bg-destructive/80 transition-colors"
            title="Close"
          />
          <button
            onClick={() => minimizeWindow(window.id)}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
            title="Minimize"
          />
          <button
            onClick={() => maximizeWindow(window.id)}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
            title="Maximize"
          />
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-40px)] overflow-auto bg-background">
        <Component windowId={window.id} />
      </div>
    </div>
  );
};

export default Window;
