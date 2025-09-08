"use client";

import { useState } from "react";
import { Button } from "./button";
import { Plus, X } from "lucide-react";

interface SimpleHabit {
  id: string;
  name: string;
  completedToday: boolean;
  createdAt: Date;
}

interface SimpleHabitCreatorProps {
  onAddHabit: (habit: Omit<SimpleHabit, 'id' | 'createdAt'>) => void;
  className?: string;
}

export function SimpleHabitCreator({ onAddHabit, className }: SimpleHabitCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [habitName, setHabitName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAddHabit({
        name: habitName.trim(),
        completedToday: false,
      });
      setHabitName("");
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setHabitName("");
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
            placeholder="e.g., Drink water, Take a walk, Read a book"
            autoFocus
          />
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
