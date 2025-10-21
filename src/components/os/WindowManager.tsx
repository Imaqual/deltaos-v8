import { useOS } from '@/contexts/OSContext';
import Window from './Window';

const WindowManager = () => {
  const { windows } = useOS();

  return (
    <div className="fixed inset-0 pointer-events-none">
      {windows.map(window => (
        <Window key={window.id} window={window} />
      ))}
    </div>
  );
};

export default WindowManager;
