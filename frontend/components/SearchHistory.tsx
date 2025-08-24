import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SearchHistoryProps = {
  history: string[];
  onSearch: (query: string) => void;
  onClearHistory: () => void;
  onRemoveHistoryItem: (item: string) => void;
  setResults: (results: Product[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  setStep: (step: number) => void;
};

export function SearchHistory({ 
  history, 
  onSearch, 
  onClearHistory, 
  onRemoveHistoryItem,
  setResults,
  setIsSearching,
  setStep
}: SearchHistoryProps) {
  const handleHistoryClick = (item: string) => {
    setResults([]);
    setIsSearching(false);
    setStep(0);
    onSearch(item);
  };

  if (history.length === 0) return null;

  return (
    <Card className="mt-4 mb-2 p-3 w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Search history:
        </span>
        <Button size="sm" variant="outline" onClick={onClearHistory}>
          Clear history
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item, idx) => (
          <div
            key={item + idx}
            className="flex items-center bg-card rounded px-2 py-1 border"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleHistoryClick(item)}
            >
              {item}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemoveHistoryItem(item)}
              className="ml-1"
            >
              x
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}