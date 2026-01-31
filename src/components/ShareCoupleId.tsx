import { useState } from 'react';
import { Copy, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getShareableCoupleId, setCoupleId } from '@/lib/firebase';

interface ShareCoupleIdProps {
  onJoinSuccess?: () => void;
}

const ShareCoupleId = ({ onJoinSuccess }: ShareCoupleIdProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [inputId, setInputId] = useState('');
  const [copied, setCopied] = useState(false);
  const coupleId = getShareableCoupleId();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coupleId);
      setCopied(true);
      toast({
        title: "✅ Copied!",
        description: "Share this ID with your partner to sync your answers.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "❌ Copy Failed",
        description: "Please copy the ID manually.",
        variant: "destructive",
      });
    }
  };

  const joinCouple = () => {
    if (!inputId.trim()) {
      toast({
        title: "⚠️ Empty ID",
        description: "Please enter a valid couple ID.",
        variant: "destructive",
      });
      return;
    }

    setCoupleId(inputId.trim());
    toast({
      title: "✅ Joined!",
      description: "Refreshing to sync with your partner's answers...",
    });

    setIsOpen(false);
    onJoinSuccess?.();

    // Reload to fetch partner's data
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Users className="w-4 h-4" />
          Share with Partner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Sync with Your Partner
          </DialogTitle>
          <DialogDescription>
            Share your couple ID to sync answers across devices
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Your ID */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Your Couple ID</Label>
            <div className="flex gap-2">
              <Input
                value={coupleId}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                onClick={copyToClipboard}
                size="icon"
                variant={copied ? "default" : "outline"}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              💡 Send this ID to your partner so they can sync with you
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          {/* Join Partner's Session */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Join Partner's Session</Label>
            <div className="space-y-2">
              <Input
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="Paste your partner's couple ID here"
                className="font-mono text-xs"
              />
              <Button
                onClick={joinCouple}
                className="w-full"
              >
                Join Session
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              ⚠️ This will sync with your partner's existing answers
            </p>
          </div>

          {/* Info */}
          <div className="bg-secondary/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>How it works:</strong>
              <br />
              • Both partners use the same couple ID
              <br />
              • Changes sync in real-time across all devices
              <br />
              • Works even when offline (syncs when back online)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareCoupleId;

