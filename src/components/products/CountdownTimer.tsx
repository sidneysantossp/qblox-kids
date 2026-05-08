import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  hours?: number;
  endTime?: string | null;
}

export function CountdownTimer({ hours = 3, endTime }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    if (endTime) {
      const difference = new Date(endTime).getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    // Fallback para o comportamento antigo
    return { hours, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (endTime) {
      // Atualizar a cada segundo quando há um endTime
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    } else {
      // Comportamento antigo de countdown
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          let { hours, minutes, seconds } = prev;
          
          if (seconds > 0) {
            seconds--;
          } else if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          } else {
            // Reiniciar o timer
            return { hours: 3, minutes: 0, seconds: 0 };
          }
          
          return { hours, minutes, seconds };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [endTime]);

  return (
    <div className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg">
      <Clock className="h-5 w-5" />
      <div className="flex items-center gap-1 font-bold text-lg">
        <span className="min-w-[2ch] text-center">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span>:</span>
        <span className="min-w-[2ch] text-center">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span>:</span>
        <span className="min-w-[2ch] text-center">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
