import { Button } from "@/components/ui/button";

type DarkModeToggleProps = {
  darkMode: boolean;
  onToggle: () => void;
};

export function DarkModeToggle({ darkMode, onToggle }: DarkModeToggleProps) {
  return (
    <Button
      variant="outline"
      className="absolute top-8 left-1/2 -translate-x-1/2"
      onClick={onToggle}
    >
      {darkMode ? "🌙 Light mode" : "🌞 Dark mode"}
    </Button>
  );
}
