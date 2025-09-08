"use client";

import { useMemo } from "react";
import { Habit, ImpressivenessTier, IMPRESSIVENESS_VALUES, DailyProgressSummary } from "@/types/habits";
import { XPSummary } from "./xp-summary";
import { SimpleHabit } from "./simple-habit";
import { ImpressivenessHabitCreator } from "./inline-habit-creator";
import { useHabitsStore } from "@/store/habitsStore";

interface HabitGridProps {
  className?: string;
}

export function HabitGrid({ className }: HabitGridProps) {
  const { 
    impressivenessHabits, 
    impressivenessHabitsLoading, 
    impressivenessHabitsError,
    addImpressivenessHabit,
    updateImpressivenessHabitEntry
  } = useHabitsStore();

  // Calculate daily XP summary
  const dailySummary = useMemo((): DailyProgressSummary => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let totalXP = 0;
    let habitsCompleted = 0;
    const tierBreakdown: Record<ImpressivenessTier, number> = { 1: 0, 2: 0, 3: 0 };
    
    impressivenessHabits.forEach(habit => {
      const todayEntry = habit.entries.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });
      
      if (todayEntry?.completed) {
        const xp = IMPRESSIVENESS_VALUES[habit.impressiveness];
        totalXP += xp;
        habitsCompleted++;
        tierBreakdown[habit.impressiveness]++;
      }
    });
    
    // Target points: aim for positive daily points (at least +20 points from positive habits)
    
    return {
      date: today,
      totalPoints: totalXP,
      targetPoints: 20,
      habitsCompleted,
      totalHabits: impressivenessHabits.length,
      maxPotentialPoints: impressivenessHabits.reduce((sum, habit) => sum + IMPRESSIVENESS_VALUES[habit.impressiveness], 0),
      tierBreakdown
    };
  }, [impressivenessHabits]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) => {
    await addImpressivenessHabit(habitData.name, habitData.impressiveness);
  };

  const toggleHabitComplete = async (habitId: string, completed: boolean) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    await updateImpressivenessHabitEntry(habitId, dateString, completed);
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
      {/* XP Summary - Centered and Prominent */}
      <div className="mb-6 flex justify-center">
        <XPSummary summary={dailySummary} className="mb-0" />
      </div>

      {/* Inline Habit Creator */}
      <ImpressivenessHabitCreator onAddHabit={addHabit} className="mb-6" />

      {/* Habits List */}
      <div className="space-y-2">
        {impressivenessHabits.map((habit) => (
          <SimpleHabit
            key={habit.id}
            habit={habit}
            onToggleComplete={toggleHabitComplete}
            isCompletedToday={isHabitCompletedToday(habit)}
          />
        ))}

        {impressivenessHabits.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="mb-1 text-sm text-slate-300">No habits added yet</p>
            <p className="text-xs text-slate-500">Create your first habit to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

