"use client";

import { useState } from "react";
import { SimpleHabitCreator } from "./simple-habit-creator";
import { Card } from "./card";
import { Button } from "./button";
import { EditHabitModal } from "./edit-habit-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { Edit, Trash2, Settings } from "lucide-react";
import { useHabitsStore } from "@/store/habitsStore";

interface SimpleHabitTrackerProps {
  className?: string;
}

export function SimpleHabitTracker({ className }: SimpleHabitTrackerProps) {
  const { 
    simpleHabits, 
    simpleHabitsLoading, 
    simpleHabitsError,
    addSimpleHabit,
    updateSimpleHabit,
    deleteSimpleHabit
  } = useHabitsStore();
  
  const [editMode, setEditMode] = useState(false);
  const [editingHabit, setEditingHabit] = useState<typeof simpleHabits[0] | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<typeof simpleHabits[0] | null>(null);

  const addHabit = async (habitData: { name: string }) => {
    await addSimpleHabit(habitData.name);
  };

  const toggleHabitComplete = async (habitId: string) => {
    if (editMode) return; // Don't toggle completion in edit mode
    
    const habit = simpleHabits.find(h => h.id === habitId);
    if (!habit) return;
    
    const newCompletedState = !habit.completedToday;
    await updateSimpleHabit(habitId, { completedToday: newCompletedState });
  };

  const handleEditHabit = (habit: typeof simpleHabits[0]) => {
    setEditingHabit(habit);
  };

  const handleSaveHabit = async (newName: string) => {
    if (editingHabit) {
      await updateSimpleHabit(editingHabit.id, { name: newName });
    }
  };

  const handleDeleteHabit = (habit: typeof simpleHabits[0]) => {
    setDeletingHabit(habit);
  };

  const confirmDeleteHabit = async () => {
    if (deletingHabit) {
      await deleteSimpleHabit(deletingHabit.id);
    }
  };

  const completedCount = simpleHabits.filter(habit => habit.completedToday).length;
  const totalCount = simpleHabits.length;

  if (simpleHabitsLoading) {
    return (
      <div className={className}>
        <div className="text-center py-12 text-slate-400">
          <div className="w-8 h-8 mx-auto mb-3 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-300">Loading habits...</p>
        </div>
      </div>
    );
  }

  if (simpleHabitsError) {
    return (
      <div className={className}>
        <div className="text-center py-12 text-red-400">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-900/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mb-1 text-sm text-red-300">{simpleHabitsError}</p>
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
      {/* Simple Progress Summary - Using same styling as XP Summary */}
      <div className="mb-6 flex justify-center">
        <Card className="p-4 bg-card border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground mb-1">
              {completedCount}/{totalCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Habits completed today
            </div>
          </div>
        </Card>
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

      {/* Simple Habit Creator */}
      <SimpleHabitCreator onAddHabit={addHabit} className="mb-6" />

      {/* Simple Habits List - Using same Card styling as growth tracker */}
      <div className="space-y-2">
        {simpleHabits.map((habit) => (
          <Card
            key={habit.id}
            className={`p-3 transition-all duration-200 ${
              editMode ? "hover:bg-accent" : "cursor-pointer hover:bg-accent"
            }`}
            onClick={() => !editMode && toggleHabitComplete(habit.id)}
          >
            <div className="flex items-center gap-3">
              {/* Completion Checkbox */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                habit.completedToday
                  ? "bg-[hsl(var(--success))] text-primary-foreground border-transparent"
                  : "border-muted-foreground bg-muted"
              }`}>
                {habit.completedToday && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Habit Info */}
              <div className="flex-1">
                <div className={`font-medium transition-colors duration-200 ${
                  habit.completedToday 
                    ? "text-muted-foreground line-through" 
                    : "text-card-foreground"
                }`}>
                  {habit.name}
                </div>
              </div>

              {/* Edit Mode Actions */}
              {editMode && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditHabit(habit);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHabit(habit);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}

        {simpleHabits.length === 0 && (
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
