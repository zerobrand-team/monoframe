'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getAiSuggestions } from '@/lib/actions';
import type { AiStyleSuggestionOutput } from '@/ai/flows/ai-style-suggestion-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

type AiSuggestionDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  foregroundImage: string;
  suggestions: AiStyleSuggestionOutput | null;
  setSuggestions: (suggestions: AiStyleSuggestionOutput | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export function AiSuggestionDialog({
  isOpen,
  setIsOpen,
  foregroundImage,
  suggestions,
  setSuggestions,
  isLoading,
  setIsLoading,
}: AiSuggestionDialogProps) {
  const { toast } = useToast();

  const handleFetchSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);
    const result = await getAiSuggestions({ photoDataUri: foregroundImage });
    if (result.success) {
      setSuggestions(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="text-primary" />
            AI Style Suggestions
          </DialogTitle>
          <DialogDescription>
            Let AI analyze your image and suggest creative backgrounds and adjustments.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {!suggestions && !isLoading && (
            <div className="text-center">
              <Button onClick={handleFetchSuggestions} size="lg">
                <Sparkles className="mr-2" />
                Generate Suggestions
              </Button>
            </div>
          )}

          {isLoading && <SuggestionsSkeleton />}
          
          {suggestions && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Suggested Backgrounds</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {suggestions.suggestedBackgrounds.map((bg, index) => (
                    <li key={index}>{bg}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Stylistic Adjustment</h4>
                <p className="text-muted-foreground italic">
                  "{suggestions.stylisticAdjustments}"
                </p>
              </div>
              <Button variant="outline" className="w-full" onClick={handleFetchSuggestions}>
                <Sparkles className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const SuggestionsSkeleton = () => (
  <div className="space-y-4">
    <div>
      <Skeleton className="h-5 w-3/5 mb-3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
    <div>
      <Skeleton className="h-5 w-2/5 mb-3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-10/12 mt-1" />
    </div>
  </div>
);
