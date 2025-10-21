import { useState } from 'react';
import { Button } from '@/components/ui/button';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperation = (op: string) => {
    setPrevious(display);
    setOperation(op);
    setDisplay('0');
  };

  const calculate = () => {
    if (!previous || !operation) return;

    const prev = parseFloat(previous);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '×': result = prev * current; break;
      case '÷': result = prev / current; break;
    }

    setDisplay(result.toString());
    setPrevious(null);
    setOperation(null);
  };

  const clear = () => {
    setDisplay('0');
    setPrevious(null);
    setOperation(null);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-muted p-4 rounded-lg mb-4 text-right">
        <div className="text-3xl font-mono">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button onClick={clear} variant="destructive" className="col-span-2">C</Button>
        <Button onClick={() => handleOperation('÷')} variant="secondary">÷</Button>
        <Button onClick={() => handleOperation('×')} variant="secondary">×</Button>
        
        {['7', '8', '9'].map(num => (
          <Button key={num} onClick={() => handleNumber(num)}>{num}</Button>
        ))}
        <Button onClick={() => handleOperation('-')} variant="secondary">-</Button>
        
        {['4', '5', '6'].map(num => (
          <Button key={num} onClick={() => handleNumber(num)}>{num}</Button>
        ))}
        <Button onClick={() => handleOperation('+')} variant="secondary">+</Button>
        
        {['1', '2', '3'].map(num => (
          <Button key={num} onClick={() => handleNumber(num)}>{num}</Button>
        ))}
        <Button onClick={calculate} variant="default" className="row-span-2">=</Button>
        
        <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
        <Button onClick={() => handleNumber('.')}>.</Button>
      </div>
    </div>
  );
};

export default CalculatorApp;
