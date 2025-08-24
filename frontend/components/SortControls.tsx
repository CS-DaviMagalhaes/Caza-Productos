import { Button } from "@/components/ui/button";

type SortControlsProps = {
  sortOrder: "asc" | "desc" | "none";
  setSortOrder: (order: "asc" | "desc" | "none") => void;
};

export function SortControls({ sortOrder, setSortOrder }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium">Order by price:</span>
      <Button
        variant={sortOrder === "asc" ? "default" : "outline"}
        size="sm"
        onClick={() => setSortOrder("asc")}
      >
        Asc
      </Button>
      <Button
        variant={sortOrder === "desc" ? "default" : "outline"}
        size="sm"
        onClick={() => setSortOrder("desc")}
      >
        Desc
      </Button>
      <Button
        variant={sortOrder === "none" ? "default" : "outline"}
        size="sm"
        onClick={() => setSortOrder("none")}
      >
        Reset
      </Button>
    </div>
  );
}
