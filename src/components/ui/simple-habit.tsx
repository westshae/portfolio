"use client";

import { Habit, ImpressivenessTier, IMPRESSIVENESS_VALUES, IMPRESSIVENESS_INFO } from "@/types/habits";
import { Card } from "./card";
import { Button } from "./button";
import { Edit, Trash2 } from "lucide-react";

interface SimpleHabitProps {
  habit: Habit;
  onToggleComplete: (habitId: string, completed: boolean) => void;
  isCompletedToday: boolean;
  editMode?: boolean;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
  className?: string;
}

export function SimpleHabit({ 
  habit, 
  onToggleComplete, 
  isCompletedToday,
  editMode = false,
  onEdit,
  onDelete,
  className 
}: SimpleHabitProps) {
  const handleToggleComplete = () => {
    onToggleComplete(habit.id, !isCompletedToday);
  };

  const getImpressivenessColor = (impressiveness: ImpressivenessTier) => {
    return IMPRESSIVENESS_INFO[impressiveness].color;
  };

  return (
    <Card 
      className={`p-3 ${className} transition-all duration-200 hover:bg-accent cursor-pointer`}
      onClick={handleToggleComplete}
    >
      <div className="flex items-center gap-3">
        {/* Completion Checkbox */}
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          isCompletedToday
            ? `${IMPRESSIVENESS_INFO[habit.impressiveness].bgColor} text-white border-transparent`
            : "border-muted-foreground bg-muted"
        }`}>
          {isCompletedToday && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Habit Info */}
        <div className="flex-1">
          <div className={`font-medium transition-colors duration-200 ${
            isCompletedToday 
              ? "text-muted-foreground line-through" 
              : "text-card-foreground"
          }`}>
            {habit.name}
          </div>
        </div>

        {/* Points Display */}
        <div className={`text-lg font-bold ${getImpressivenessColor(habit.impressiveness)}`}>
          {IMPRESSIVENESS_VALUES[habit.impressiveness]} pts
        </div>

        {/* Edit Mode Actions */}
        {editMode && (
          <div className="flex items-center gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(habit);
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
                onDelete?.(habit);
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
  );
}
