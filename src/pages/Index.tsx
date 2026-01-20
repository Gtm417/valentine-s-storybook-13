import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ValentineBook from '@/components/ValentineBook';
import FloatingHearts from '@/components/FloatingHearts';

const TOTAL_PAGES = 100;

const createInitialPages = () => 
  Array.from({ length: TOTAL_PAGES }, () => "");

const Index = () => {
  const [myPages, setMyPages] = useState<string[]>(createInitialPages);
  const [herPages, setHerPages] = useState<string[]>(createInitialPages);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating hearts background */}
      <FloatingHearts />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-6 pb-2 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-1">
            <Heart className="w-7 h-7 text-primary fill-primary heartbeat" />
            <h1 className="text-3xl md:text-4xl font-display text-romantic-gradient">
              Our Love Story
            </h1>
            <Heart className="w-7 h-7 text-primary fill-primary heartbeat" />
          </div>
          <p className="text-muted-foreground font-serif">
            100 reasons why I love you
          </p>
        </motion.header>

        {/* Tabs */}
        <div className="flex-1 flex flex-col items-center px-4 pb-6">
          <Tabs defaultValue="me" className="w-full max-w-2xl">
            <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-6 bg-secondary/70 backdrop-blur-sm">
              <TabsTrigger 
                value="me" 
                className="gap-2 font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Heart className="w-4 h-4" />
                For Me
              </TabsTrigger>
              <TabsTrigger 
                value="her" 
                className="gap-2 font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Heart className="w-4 h-4" />
                For Her
              </TabsTrigger>
            </TabsList>

            <TabsContent value="me" className="mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ValentineBook 
                  pages={myPages} 
                  onPagesChange={setMyPages}
                  tabName="My"
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="her" className="mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ValentineBook 
                  pages={herPages} 
                  onPagesChange={setHerPages}
                  tabName="Her"
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="py-3 text-center text-muted-foreground font-serif text-sm"
        >
          Made with <Heart className="w-4 h-4 inline text-primary fill-primary" /> for Valentine's Day
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
