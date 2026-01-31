import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface HeartPageProps {
  pageNumber: number;
  totalPages: number;
  templateText: string;
  filledText: string;
  onFilledTextChange: (text: string) => void;
  isFinalPage?: boolean;
}

const HeartPage = ({
  pageNumber,
  totalPages,
  templateText,
  filledText,
  onFilledTextChange,
  isFinalPage = false,
}: HeartPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [isEditing]);

  const handleBlankClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  if (isFinalPage) {
    return (
      <div className="relative w-full min-h-[500px] flex items-center justify-center">
        {/* Page number */}
        <div className="absolute top-0 right-8 text-primary/60 text-sm font-serif">
          {pageNumber} / {totalPages}
        </div>

        {/* Decorative hearts around the page */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-12"
        >
          <Heart className="w-16 h-16 md:w-20 md:h-20 text-primary/30 fill-primary/20" />
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-24 right-12"
        >
          <Heart className="w-12 h-12 md:w-16 md:h-16 text-primary/40 fill-primary/30" />
        </motion.div>

        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-24 left-16"
        >
          <Heart className="w-14 h-14 md:w-18 md:h-18 text-primary/35 fill-primary/25" />
        </motion.div>

        <motion.div
          animate={{ y: [8, -8, 8], rotate: [0, -5, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-32 right-20"
        >
          <Heart className="w-10 h-10 md:w-14 md:h-14 text-primary/45 fill-primary/35" />
        </motion.div>

        {/* Small sparkle hearts */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1/3 left-1/4"
        >
          <Heart className="w-6 h-6 text-primary/50 fill-primary/40" />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.3, repeat: Infinity, delay: 0.7 }}
          className="absolute top-2/3 right-1/4"
        >
          <Heart className="w-8 h-8 text-primary/50 fill-primary/40" />
        </motion.div>

        {/* Central content - text input */}
        <div className="relative z-10 flex flex-col items-start gap-6 px-4 md:px-8 lg:px-16 w-full">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-2 self-center"
          >
            <Heart className="w-16 h-16 md:w-20 md:h-20 text-primary fill-primary drop-shadow-lg" />
          </motion.div>

          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={filledText}
              onChange={(e) => onFilledTextChange(e.target.value)}
              onBlur={handleInputBlur}
              placeholder="Your message..."
              rows={6}
              className="text-xl md:text-2xl lg:text-3xl font-display text-justify text-primary bg-transparent border-2 border-primary/30 rounded-lg px-6 py-4 w-full focus:outline-none focus:border-primary transition-colors placeholder:text-primary/30 leading-relaxed resize-none indent-8"
            />
          ) : (
            <div
              onClick={handleBlankClick}
              className="text-xl md:text-2xl lg:text-3xl font-display text-justify text-primary cursor-pointer hover:opacity-80 transition-opacity leading-relaxed px-6 py-4 w-full min-h-[200px] whitespace-pre-wrap break-words indent-8"
            >
              {filledText || (
                <span className="text-primary/40 border-b-2 border-dashed border-primary/30 px-2">Click to write your message...</span>
              )}
            </div>
          )}

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex gap-3 mt-2 self-center"
          >
            <Heart className="w-4 h-4 text-primary/60 fill-primary/50" />
            <Heart className="w-5 h-5 text-primary/70 fill-primary/60" />
            <Heart className="w-4 h-4 text-primary/60 fill-primary/50" />
          </motion.div>
        </div>

        {/* Sparkles decoration */}
        <Sparkles className="absolute top-1/4 left-1/3 w-6 h-6 text-primary/40 sparkle" />
        <Sparkles className="absolute top-1/3 right-1/3 w-5 h-5 text-primary/40 sparkle" style={{ animationDelay: '0.7s' }} />
        <Sparkles className="absolute bottom-1/3 left-1/2 w-5 h-5 text-primary/40 sparkle" style={{ animationDelay: '1.4s' }} />
        <Sparkles className="absolute bottom-1/4 right-1/2 w-4 h-4 text-primary/40 sparkle" style={{ animationDelay: '2s' }} />
      </div>
    );
  }

  return (
    <div className="heart-container">
      <div className="heart-shape">
        <div className="heart-shine" />
        <div className="heart-inner-glow" />
      </div>
      <div className="heart-content">
        {/* Page number */}
        <div className="absolute top-6 right-1/4 text-white/60 text-sm font-serif">
          {pageNumber} / {totalPages}
        </div>

        {/* Template content */}
        <div className="flex flex-col items-center gap-3 max-w-[200px] md:max-w-[260px]">
          <p className="template-text text-base md:text-lg leading-relaxed">
            {templateText}
          </p>
          
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={filledText}
              onChange={(e) => onFilledTextChange(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              placeholder="fill in..."
              className="fill-input text-base md:text-lg w-full"
            />
          ) : (
            <p 
              onClick={handleBlankClick}
              className="text-base md:text-lg font-serif italic text-white/90 min-h-[28px] cursor-pointer hover:opacity-80 transition-opacity"
            >
              {filledText || (
                <span className="text-white/50 border-b-2 border-dashed border-white/30 px-2">___________</span>
              )}
            </p>
          )}
        </div>

        {/* Small decorative hearts */}
        <div className="absolute bottom-8 flex gap-2">
          <Heart className="w-3 h-3 text-white/50 fill-white/50" />
          <Heart className="w-4 h-4 text-white/70 fill-white/70" />
          <Heart className="w-3 h-3 text-white/50 fill-white/50" />
        </div>
      </div>
    </div>
  );
};

export default HeartPage;
