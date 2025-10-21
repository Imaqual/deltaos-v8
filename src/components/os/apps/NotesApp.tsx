import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

const NotesApp = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('deltaos-notes');
    if (saved) setContent(saved);
  }, []);

  const handleChange = (value: string) => {
    setContent(value);
    localStorage.setItem('deltaos-notes', value);
  };

  return (
    <div className="p-4 h-full">
      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start typing your notes..."
        className="w-full h-full resize-none font-mono"
      />
    </div>
  );
};

export default NotesApp;
