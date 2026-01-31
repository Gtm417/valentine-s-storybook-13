import { useState } from 'react';
import { Download, Upload, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  clearAllData,
  exportData,
  importData,
  getStorageStats,
  getStorageSize
} from '@/lib/storage';

interface StorageManagerProps {
  onDataCleared?: () => void;
  onDataImported?: () => void;
}

const StorageManager = ({ onDataCleared, onDataImported }: StorageManagerProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `valentine-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "✅ Backup Created",
        description: "Your answers have been exported successfully.",
      });
    } catch (e) {
      toast({
        title: "❌ Export Failed",
        description: "Could not create backup file.",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (importData(content)) {
            toast({
              title: "✅ Data Restored",
              description: "Your answers have been imported successfully.",
            });
            setIsOpen(false);
            onDataImported?.();
            // Reload the page to reflect changes
            window.location.reload();
          } else {
            toast({
              title: "❌ Import Failed",
              description: "Invalid backup file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all your answers? This cannot be undone.')) {
      clearAllData();
      toast({
        title: "🗑️ Data Cleared",
        description: "All your answers have been deleted.",
      });
      setIsOpen(false);
      onDataCleared?.();
      // Reload the page to reflect changes
      window.location.reload();
    }
  };

  const stats = getStorageStats();
  const storageSize = getStorageSize();
  const totalFilled = Object.values(stats).reduce((sum, stat) => sum + stat.filledPages, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Info className="w-4 h-4" />
          Storage Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>💾 Storage Manager</DialogTitle>
          <DialogDescription>
            Manage your saved answers and create backups
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Filled Pages:</span>
              <span className="font-semibold">{totalFilled} / 200</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage Used:</span>
              <span className="font-semibold">{storageSize.usedFormatted}</span>
            </div>
            {Object.entries(stats).map(([key, stat]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{key.includes('my') ? 'For Me' : 'For Her'}:</span>
                <span>{stat.filledPages} pages</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleExport}
              className="w-full gap-2"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              Export Backup
            </Button>

            <Button
              onClick={handleImport}
              className="w-full gap-2"
              variant="outline"
            >
              <Upload className="w-4 h-4" />
              Import Backup
            </Button>

            <Button
              onClick={handleClear}
              className="w-full gap-2"
              variant="destructive"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </Button>
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground">
            💡 Your answers are automatically saved in your browser.
            Create backups to keep your data safe across devices or browsers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StorageManager;

