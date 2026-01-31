import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeartPage from './HeartPage';
import { pageTemplates } from '@/data/pageTemplates';

interface ValentineBookProps {
  pages: string[];
  onPagesChange: (pages: string[]) => void;
  tabName: string;
}

const ValentineBook = ({ pages, onPagesChange, tabName }: ValentineBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const updatePageContent = (content: string) => {
    const newPages = [...pages];
    newPages[currentPage] = content;
    onPagesChange(newPages);
  };

  const pageVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.85,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.85,
    }),
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-7xl mx-auto px-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Heart className="w-5 h-5 text-primary fill-primary heartbeat" />
        <h2 className="text-xl md:text-2xl font-display text-romantic-gradient">{tabName}'s Love Notes</h2>
        <Heart className="w-5 h-5 text-primary fill-primary heartbeat" />
      </motion.div>

      {/* Heart with page flip animation */}
      <div className="relative flex justify-center" style={{ perspective: '1200px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.25 },
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="flex justify-center"
          >
            <HeartPage
              pageNumber={currentPage + 1}
              totalPages={totalPages}
              templateText={pageTemplates[currentPage] || ""}
              filledText={pages[currentPage]}
              onFilledTextChange={updatePageContent}
              isFinalPage={currentPage === totalPages - 1}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button
          onClick={prevPage}
          disabled={currentPage === 0}
          variant="outline"
          size="icon"
          className="rounded-full w-11 h-11 transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 border-primary/30"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2 min-w-[100px] justify-center">
          <span className="text-xl font-display text-primary">{currentPage + 1}</span>
          <span className="text-muted-foreground font-serif">of {totalPages}</span>
        </div>

        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          variant="outline"
          size="icon"
          className="rounded-full w-11 h-11 transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground disabled:opacity-30 border-primary/30"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick page jumper */}
      <div className="flex gap-1.5 flex-wrap justify-center max-w-sm">
        {Array.from({ length: Math.min(10, totalPages) }).map((_, i) => {
          const pageIndex = Math.max(0, Math.min(currentPage - 4, totalPages - 10)) + i;
          if (pageIndex >= totalPages) return null;
          return (
            <button
              key={pageIndex}
              onClick={() => {
                setDirection(pageIndex > currentPage ? 1 : -1);
                setCurrentPage(pageIndex);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                pageIndex === currentPage 
                  ? 'bg-primary w-5' 
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
            />
          );
        })}
        {totalPages > 10 && currentPage < totalPages - 6 && (
          <span className="text-muted-foreground text-xs ml-1">...</span>
        )}
      </div>
    </div>
  );
};

export default ValentineBook;
