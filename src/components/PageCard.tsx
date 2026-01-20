import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface PageCardProps {
  pageNumber: number;
  totalPages: number;
  content: string;
  isEditing: boolean;
  onContentChange: (content: string) => void;
  isFinalPage?: boolean;
}

const PageCard = ({ 
  pageNumber, 
  totalPages, 
  content, 
  isEditing, 
  onContentChange,
  isFinalPage = false 
}: PageCardProps) => {
  
  if (isFinalPage) {
    return (
      <div className="love-card w-full max-w-lg aspect-square flex flex-col items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-6"
          >
            <Heart className="w-24 h-24 text-primary fill-primary mx-auto" />
          </motion.div>
          
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Your final message of love..."
              className="text-2xl font-display text-center bg-transparent border-dashed border-2 border-primary/30 focus:border-primary min-h-[120px] resize-none"
            />
          ) : (
            <h2 className="text-3xl md:text-4xl font-display romantic-text leading-relaxed">
              {content || "I Love You Forever ❤️"}
            </h2>
          )}
        </motion.div>
        
        {/* Decorative sparkles */}
        <Sparkles className="absolute top-4 left-4 w-6 h-6 text-gold sparkle" />
        <Sparkles className="absolute top-4 right-4 w-6 h-6 text-gold sparkle" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-gold sparkle" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute bottom-4 right-4 w-6 h-6 text-gold sparkle" style={{ animationDelay: '1.5s' }} />
      </div>
    );
  }

  return (
    <div className="love-card w-full max-w-lg aspect-square flex flex-col relative overflow-hidden">
      {/* Page number */}
      <div className="absolute top-3 right-4 text-sm text-muted-foreground font-serif">
        {pageNumber} / {totalPages}
      </div>
      
      {/* Decorative hearts */}
      <div className="absolute top-3 left-4">
        <Heart className="w-5 h-5 text-rose-light fill-rose-light floating-heart" />
      </div>
      
      {/* Content area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-10">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={`Write something lovely for page ${pageNumber}...`}
            className="text-lg font-serif text-center bg-transparent border-dashed border-2 border-primary/30 focus:border-primary min-h-[200px] resize-none w-full"
          />
        ) : (
          <p className="text-lg md:text-xl font-serif text-foreground leading-relaxed text-center">
            {content || `Page ${pageNumber} - Click edit to add your message`}
          </p>
        )}
      </div>
      
      {/* Bottom decoration */}
      <div className="flex justify-center gap-2 pb-4">
        <Heart className="w-3 h-3 text-rose-light fill-rose-light" />
        <Heart className="w-4 h-4 text-primary fill-primary" />
        <Heart className="w-3 h-3 text-rose-light fill-rose-light" />
      </div>
    </div>
  );
};

export default PageCard;
