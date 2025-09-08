"use client";

import { useState } from "react";
import { Habit, ImpressivenessTier, IMPRESSIVENESS_VALUES, IMPRESSIVENESS_INFO } from "@/types/habits";
import { Button } from "./button";
import { Plus, X } from "lucide-react";

interface ImpressivenessHabitCreatorProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) => void;
  className?: string;
}

export function ImpressivenessHabitCreator({ onAddHabit, className }: ImpressivenessHabitCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [selectedImpressiveness, setSelectedImpressiveness] = useState<ImpressivenessTier>(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit({
        name: habitName.trim(),
        impressiveness: selectedImpressiveness,
      });
      setHabitName("");
      setSelectedImpressiveness(2);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setHabitName("");
    setSelectedImpressiveness(2);
    setIsCreating(false);
  };

  if (!isCreating) {
    return (
             <Button
         onClick={() => setIsCreating(true)}
         size="default"
         className="w-full flex items-center justify-center gap-2 transition-all duration-200"
       >
        <Plus className="h-4 w-4" />
        <span>Add New Habit</span>
      </Button>
    );
  }

  return (
    <div className={`p-4 border border-border rounded-lg bg-card ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-card-foreground">
            Add New Habit
          </h3>
          <button
            type="button"
            onClick={handleCancel}
            className="p-1 hover:bg-accent rounded-full transition-colors duration-200"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Habit Name Input */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Habit Name
          </label>
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
            placeholder="e.g., Walk 30 minutes, Go to gym, Eat healthy"
            autoFocus
          />
        </div>

        {/* Impressiveness Selection */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Impressiveness Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([1, 2, 3] as ImpressivenessTier[]).map((impressiveness) => {
              const info = IMPRESSIVENESS_INFO[impressiveness];
              
              return (
                <button
                  key={impressiveness}
                  type="button"
                  onClick={() => setSelectedImpressiveness(impressiveness)}
                  className={`p-2 rounded-md border-2 transition-all duration-200 ${
                    selectedImpressiveness === impressiveness
                      ? "bg-background"
                      : "border-border bg-background hover:border-ring hover:bg-accent"
                  }`}
                  style={{
                    borderColor: selectedImpressiveness === impressiveness ? 
                      (impressiveness === 1 ? '#3b82f6' : 
                       impressiveness === 2 ? '#10b981' : 
                       '#8b5cf6') : undefined
                  }}
                >
                  <div 
                    className="text-lg font-bold"
                    style={{ 
                      color: impressiveness === 1 ? '#3b82f6' : 
                             impressiveness === 2 ? '#10b981' : 
                             '#8b5cf6'
                    }}
                  >
                    {IMPRESSIVENESS_VALUES[impressiveness]}
                  </div>
                  <div className="text-xs text-muted-foreground">{info.name}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
            {IMPRESSIVENESS_INFO[selectedImpressiveness].description}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
                     <Button 
             type="submit" 
             size="default" 
             variant="outline"
             className="flex-1" 
             disabled={!habitName.trim()}
           >
             Add Habit
           </Button>
           <Button 
             type="button" 
             onClick={handleCancel} 
             size="default" 
             variant="outline" 
             className="flex-1"
           >
             Cancel
           </Button>
        </div>
      </form>
    </div>
  );
}
