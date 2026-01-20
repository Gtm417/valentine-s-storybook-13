import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FloatingHeart {
  id: number;
  x: number;
  delay: number;
  size: number;
  duration: number;
}

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart: FloatingHeart = {
        id: Date.now(),
        x: Math.random() * 100,
        delay: 0,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 3 + 4,
      };
      setHearts(prev => [...prev.slice(-15), newHeart]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ 
            x: `${heart.x}vw`, 
            y: '100vh',
            opacity: 0.8,
            rotate: 0 
          }}
          animate={{ 
            y: '-100px',
            opacity: 0,
            rotate: 360 
          }}
          transition={{ 
            duration: heart.duration,
            ease: 'easeOut',
            delay: heart.delay 
          }}
          className="absolute"
          style={{ left: `${heart.x}%` }}
          onAnimationComplete={() => {
            setHearts(prev => prev.filter(h => h.id !== heart.id));
          }}
        >
          <Heart 
            size={heart.size} 
            className="text-primary fill-primary opacity-60"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
