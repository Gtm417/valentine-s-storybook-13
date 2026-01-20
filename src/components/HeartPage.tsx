import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface HeartPageProps {
  pageNumber: number;
  totalPages: number;
  templateText: string;
  filledText: string;
  isEditing: boolean;
  onFilledTextChange: (text: string) => void;
  isFinalPage?: boolean;
}

const HeartPage = ({
  pageNumber,
  totalPages,
  templateText,
  filledText,
  isEditing,
  onFilledTextChange,
  isFinalPage = false,
}: HeartPageProps) => {
  
  if (isFinalPage) {
    return (
      <div className="heart-container pulse-glow">
        <div className="heart-shape" />
        <div className="heart-content">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 md:w-16 md:h-16 text-white fill-white drop-shadow-lg" />
            </motion.div>
            
            {isEditing ? (
              <input
                type="text"
                value={filledText}
                onChange={(e) => onFilledTextChange(e.target.value)}
                placeholder="Your final message..."
                className="fill-input text-xl md:text-2xl font-display w-full"
              />
            ) : (
              <h2 className="text-2xl md:text-3xl font-display romantic-text leading-relaxed">
                {filledText || "I Love You Forever"}
              </h2>
            )}
            
            <Sparkles className="absolute top-16 left-1/4 w-5 h-5 text-white/80 sparkle" />
            <Sparkles className="absolute top-20 right-1/4 w-4 h-4 text-white/80 sparkle" style={{ animationDelay: '0.7s' }} />
            <Sparkles className="absolute bottom-24 left-1/3 w-4 h-4 text-white/80 sparkle" style={{ animationDelay: '1.4s' }} />
          </motion.div>
          
          <div className="absolute bottom-8 text-white/60 text-sm font-serif">
            {pageNumber} / {totalPages}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="heart-container">
      <div className="heart-shape" />
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
              type="text"
              value={filledText}
              onChange={(e) => onFilledTextChange(e.target.value)}
              placeholder="fill in..."
              className="fill-input text-base md:text-lg w-full"
            />
          ) : (
            <p className="text-base md:text-lg font-serif italic text-white/90 min-h-[28px]">
              {filledText || (
                <span className="text-white/50">___________</span>
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
