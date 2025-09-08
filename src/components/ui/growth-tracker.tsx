"use client";

import { useState, useMemo } from "react";
import { Habit, DailyProgressSummary, ImpressivenessTier, IMPRESSIVENESS_VALUES } from "@/types/habits";
import { ProgressBarGraph } from "./progress-bar-graph";
import { SimpleHabit } from "./simple-habit";
import { ImpressivenessHabitCreator } from "./inline-habit-creator";
import { Button } from "./button";
import { EditHabitModal } from "./edit-habit-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { Settings } from "lucide-react";
import { useHabitsStore } from "@/store/habitsStore";

interface GrowthTrackerProps {
  className?: string;
}

export function GrowthTracker({ className }: GrowthTrackerProps) {
  const { 
    impressivenessHabits, 
    impressivenessHabitsLoading, 
    impressivenessHabitsError,
    addImpressivenessHabit,
    updateImpressivenessHabit,
    deleteImpressivenessHabit,
    updateImpressivenessHabitEntry
  } = useHabitsStore();
  
  const [editMode, setEditMode] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  // Calculate daily progress summary
  const dailySummary = useMemo((): DailyProgressSummary => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let totalPoints = 0;
    let habitsCompleted = 0;
    let maxPotentialPoints = 0;
    const tierBreakdown: Record<ImpressivenessTier, number> = { 1: 0, 2: 0, 3: 0 };
    
    impressivenessHabits.forEach(habit => {
      const todayEntry = habit.entries.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });
      
      // Calculate maximum potential points (sum of all impressiveness values)
      const points = IMPRESSIVENESS_VALUES[habit.impressiveness];
      maxPotentialPoints += points;
      
      if (todayEntry?.completed) {
        totalPoints += points;
        habitsCompleted++;
        tierBreakdown[habit.impressiveness]++;
      }
    });
    
    // Target points: aim for completing most habits
    const targetPoints = Math.ceil(maxPotentialPoints * 0.7); // 70% of max potential
    
    return {
      date: today,
      totalPoints,
      targetPoints,
      habitsCompleted,
      totalHabits: impressivenessHabits.length,
      maxPotentialPoints,
      tierBreakdown
    };
  }, [impressivenessHabits]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) => {
    await addImpressivenessHabit(habitData.name, habitData.impressiveness);
  };

  const toggleHabitComplete = async (habitId: string, completed: boolean) => {
    if (editMode) return; // Don't toggle completion in edit mode
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Use local date formatting to avoid timezone issues
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    await updateImpressivenessHabitEntry(habitId, dateString, completed);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleSaveHabit = async (newName: string) => {
    if (editingHabit) {
      await updateImpressivenessHabit(editingHabit.id, { name: newName });
    }
  };

  const handleDeleteHabit = (habit: Habit) => {
    setDeletingHabit(habit);
  };

  const confirmDeleteHabit = async () => {
    if (deletingHabit) {
      await deleteImpressivenessHabit(deletingHabit.id);
    }
  };

  const isHabitCompletedToday = (habit: Habit): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return habit.entries.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime() && entry.completed;
    });
  };

  if (impressivenessHabitsLoading) {
    return (
      <div className={className}>
        <div className="text-center py-12 text-slate-400">
          <div className="w-8 h-8 mx-auto mb-3 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-300">Loading habits...</p>
        </div>
      </div>
    );
  }

  if (impressivenessHabitsError) {
    return (
      <div className={className}>
        <div className="text-center py-12 text-red-400">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-900/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mb-1 text-sm text-red-300">{impressivenessHabitsError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs text-red-500 hover:text-red-400 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Progress Bar Graph - Centered and Prominent */}
      <div className="mb-6 flex justify-center">
        <ProgressBarGraph summary={dailySummary} className="mb-0" />
      </div>

      {/* Edit Mode Toggle */}
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => setEditMode(!editMode)}
          variant={editMode ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {editMode ? "Exit Edit" : "Edit Mode"}
        </Button>
      </div>

      {/* Impressiveness Habit Creator */}
      <ImpressivenessHabitCreator onAddHabit={addHabit} className="mb-6" />

      {/* Habits List */}
      <div className="space-y-2">
        {impressivenessHabits.map((habit) => (
          <SimpleHabit
            key={habit.id}
            habit={habit}
            onToggleComplete={toggleHabitComplete}
            isCompletedToday={isHabitCompletedToday(habit)}
            editMode={editMode}
            onEdit={handleEditHabit}
            onDelete={handleDeleteHabit}
          />
        ))}

        {impressivenessHabits.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="mb-1 text-sm text-foreground">No habits added yet</p>
            <p className="text-xs text-muted-foreground">Create your first habit to get started!</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditHabitModal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        onSave={handleSaveHabit}
        currentName={editingHabit?.name || ""}
      />
      
      <DeleteConfirmationModal
        isOpen={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={confirmDeleteHabit}
        habitName={deletingHabit?.name || ""}
      />
    </div>
  );
}
