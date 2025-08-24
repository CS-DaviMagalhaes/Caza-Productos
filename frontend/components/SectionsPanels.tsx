import { useState } from "react";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Section = {
  id: string;
  name: string;
  products: Product[];
};

type SectionsPanelProps = {
  showSections: boolean;
  setShowSections: (show: boolean | ((prev: boolean) => boolean)) => void;
  sections: Section[];
  setSections: (sections: Section[] | ((prev: Section[]) => Section[])) => void;
  onDropProduct: (sectionId: string) => void;
};

export function SectionsPanel({ 
  showSections, 
  setShowSections, 
  sections, 
  setSections, 
  onDropProduct 
}: SectionsPanelProps) {
  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");

  const addSection = () => {
    if (!newSectionName.trim()) return;
    setSections((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newSectionName.trim(), products: [] },
    ]);
    setNewSectionName("");
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const startEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    setEditingSectionName(section.name);
  };

  const saveEditSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, name: editingSectionName.trim() || s.name } : s
      )
    );
    setEditingSectionId(null);
    setEditingSectionName("");
  };

  const cancelEditSection = () => {
    setEditingSectionId(null);
    setEditingSectionName("");
  };

  return (
    <>
      <Button
        variant="secondary"
        className="fixed top-8 left-8 z-20"
        onClick={() => setShowSections((s) => !s)}
      >
        {showSections ? "Close Sections" : "☰ Sections"}
      </Button>
      <div
        className={`fixed top-0 left-0 h-screen w-80 bg-background border-r border-blue-500 z-30 transition-transform duration-300 ${
          showSections ? "translate-x-0" : "-translate-x-96"
        } flex flex-col p-6`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">My Sections</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSections(false)}
            aria-label="Close sections"
          >
            ×
          </Button>
        </div>
        <div className="flex mb-4">
          <Input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Section name"
            className="mr-2"
          />
          <Button onClick={addSection}>Create</Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sections.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No sections created.
            </div>
          ) : (
            sections.map((section) => (
              <Card
                key={section.id}
                className="mb-3 p-3 border border-blue-500"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDropProduct(section.id)}
              >
                <div className="flex justify-between items-center">
                  {editingSectionId === section.id ? (
                    <div className="flex items-center w-full">
                      <Input
                        value={editingSectionName}
                        onChange={(e) => setEditingSectionName(e.target.value)}
                        autoFocus
                        className="mr-2"
                      />
                      <Button
                        size="sm"
                        onClick={() => saveEditSection(section.id)}
                        className="mr-1"
                      >
                        ✔
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={cancelEditSection}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold">{section.name}</span>
                      <div className="flex items-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditSection(section)}
                          className="mr-1"
                        >
                          ✎
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeSection(section.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  {section.products.length === 0 ? (
                    <span className="text-muted-foreground text-xs">
                      Drag favorite products here
                    </span>
                  ) : (
                    <ul>
                      {section.products.map((product) => (
                        <li
                          key={product.id}
                          className="flex justify-between items-center mb-1 bg-orange-50 dark:bg-orange-950 rounded px-2 py-1 border border-orange-400"
                        >
                          <span>{product.name}</span>
                          <a
                            href={product.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline ml-2"
                          >
                            View
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}