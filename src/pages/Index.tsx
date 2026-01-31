import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Cloud, CloudOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ValentineBook from '@/components/ValentineBook';
import FloatingHearts from '@/components/FloatingHearts';
import StorageManager from '@/components/StorageManager';
import ShareCoupleId from '@/components/ShareCoupleId';
import { useToast } from '@/hooks/use-toast';
import { isLocalStorageAvailable, getStorageStats } from '@/lib/storage';
import {
  saveAnswersToFirebase,
  loadAnswersFromFirebase,
  listenToAnswers,
  isFirebaseConnected,
} from '@/lib/firebase';

const TOTAL_PAGES = 100;
const STORAGE_KEY_MY = 'valentine-my-pages';
const STORAGE_KEY_HER = 'valentine-her-pages';

const createInitialPages = () => 
  Array.from({ length: TOTAL_PAGES }, () => "");

const loadPages = async (key: string): Promise<string[]> => {
  try {
    // Try Firebase first
    const tab = key === STORAGE_KEY_MY ? 'my' : 'her';
    const firebaseData = await loadAnswersFromFirebase(tab as 'my' | 'her');

    if (firebaseData && Array.isArray(firebaseData) && firebaseData.length === TOTAL_PAGES) {
      console.log(`✅ Loaded ${firebaseData.filter(p => p).length} filled pages from Firebase (${key})`);
      // Save to localStorage for offline access
      localStorage.setItem(key, JSON.stringify(firebaseData));
      return firebaseData;
    }

    // Fallback to localStorage
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === TOTAL_PAGES) {
        console.log(`✅ Loaded ${parsed.filter(p => p).length} filled pages from localStorage (${key})`);
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load pages:', e);
  }
  console.log(`📝 Creating new pages for ${key}`);
  return createInitialPages();
};

const savePages = async (key: string, pages: string[]) => {
  try {
    // Save to localStorage immediately
    localStorage.setItem(key, JSON.stringify(pages));
    console.log(`💾 Saved ${pages.filter(p => p).length} filled pages to localStorage (${key})`);

    // Sync to Firebase
    const tab = key === STORAGE_KEY_MY ? 'my' : 'her';
    await saveAnswersToFirebase(tab as 'my' | 'her', pages);
  } catch (e) {
    console.error('Failed to save pages:', e);
  }
};

const Index = () => {
  const { toast } = useToast();
  const [myPages, setMyPages] = useState<string[]>(createInitialPages());
  const [herPages, setHerPages] = useState<string[]>(createInitialPages());
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseOnline, setIsFirebaseOnline] = useState(false);

  // Load initial data from Firebase/localStorage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [myData, herData, firebaseStatus] = await Promise.all([
          loadPages(STORAGE_KEY_MY),
          loadPages(STORAGE_KEY_HER),
          isFirebaseConnected(),
        ]);

        setMyPages(myData);
        setHerPages(herData);
        setIsFirebaseOnline(firebaseStatus);

        if (firebaseStatus) {
          toast({
            title: "☁️ Connected to Cloud",
            description: "Your answers will sync across devices.",
          });
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [toast]);

  // Check localStorage availability on mount
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      toast({
        title: "⚠️ Storage Warning",
        description: "Your browser's localStorage is not available. Your answers will not be saved.",
        variant: "destructive",
      });
    } else {
      // Log storage stats for debugging
      const stats = getStorageStats();
      console.log('📊 Storage stats:', stats);
    }
    setIsInitialMount(false);
  }, [toast]);

  // Listen for real-time updates from Firebase
  useEffect(() => {
    if (isLoading) return;

    const unsubscribeHer = listenToAnswers('her', (pages) => {
      setHerPages(pages);
      localStorage.setItem(STORAGE_KEY_HER, JSON.stringify(pages));
    });

    const unsubscribeMy = listenToAnswers('my', (pages) => {
      setMyPages(pages);
      localStorage.setItem(STORAGE_KEY_MY, JSON.stringify(pages));
    });

    return () => {
      unsubscribeHer();
      unsubscribeMy();
    };
  }, [isLoading]);

  // Auto-save on changes
  useEffect(() => {
    if (isInitialMount || isLoading) return;
    savePages(STORAGE_KEY_MY, myPages);
  }, [myPages, isInitialMount, isLoading]);

  useEffect(() => {
    if (isInitialMount || isLoading) return;
    savePages(STORAGE_KEY_HER, herPages);
  }, [herPages, isInitialMount, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary fill-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your love story...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-center gap-2 mt-2">
            {isFirebaseOnline ? (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Cloud className="w-3 h-3" />
                Cloud Sync Active
              </span>
            ) : (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <CloudOff className="w-3 h-3" />
                Offline Mode
              </span>
            )}
          </div>
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
          className="py-3 text-center text-muted-foreground font-serif text-sm space-y-2"
        >
          <div>
            Made with <Heart className="w-4 h-4 inline text-primary fill-primary" /> for Valentine's Day
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <ShareCoupleId
              onJoinSuccess={() => {
                // Reload data after joining
                window.location.reload();
              }}
            />
            <StorageManager
              onDataCleared={() => {
                setMyPages(createInitialPages());
                setHerPages(createInitialPages());
              }}
              onDataImported={async () => {
                const myData = await loadPages(STORAGE_KEY_MY);
                const herData = await loadPages(STORAGE_KEY_HER);
                setMyPages(myData);
                setHerPages(herData);
              }}
            />
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
