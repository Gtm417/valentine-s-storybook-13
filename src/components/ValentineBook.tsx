import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Edit3, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageCard from './PageCard';

interface ValentineBookProps {
  pages: string[];
  onPagesChange: (pages: string[]) => void;
  tabName: string;
}

const ValentineBook = ({ pages, onPagesChange, tabName }: ValentineBookProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
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
      scale: 0.9,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">
      {/* Header with tab name and heart */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Heart className="w-6 h-6 text-primary fill-primary heartbeat" />
        <h2 className="text-2xl md:text-3xl font-display text-romantic">{tabName}'s Love Notes</h2>
        <Heart className="w-6 h-6 text-primary fill-primary heartbeat" />
      </motion.div>

      {/* Edit button */}
      <Button
        onClick={() => setIsEditing(!isEditing)}
        variant={isEditing ? "default" : "outline"}
        size="sm"
        className="gap-2"
      >
        {isEditing ? (
          <>
            <Check className="w-4 h-4" />
            Done Editing
          </>
        ) : (
          <>
            <Edit3 className="w-4 h-4" />
            Edit Pages
          </>
        )}
      </Button>

      {/* Card with page flip animation */}
      <div className="relative w-full flex justify-center" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full flex justify-center"
          >
            <PageCard
              pageNumber={currentPage + 1}
              totalPages={totalPages}
              content={pages[currentPage]}
              isEditing={isEditing}
              onContentChange={updatePageContent}
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
          className="rounded-full w-12 h-12 transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        
        <div className="flex items-center gap-2 min-w-[120px] justify-center">
          <span className="text-muted-foreground font-serif">Page</span>
          <span className="text-xl font-display text-primary">{currentPage + 1}</span>
          <span className="text-muted-foreground font-serif">of {totalPages}</span>
        </div>

        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Page dots indicator (showing nearby pages) */}
      <div className="flex gap-1 flex-wrap justify-center max-w-md">
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
                  ? 'bg-primary w-4' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          );
        })}
        {totalPages > 10 && currentPage < totalPages - 6 && (
          <span className="text-muted-foreground text-xs">...</span>
        )}
      </div>
    </div>
  );
};

export default ValentineBook;
