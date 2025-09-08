// Impressiveness-based habit system
export type ImpressivenessTier = 1 | 2 | 3;

// Impressiveness values for each tier
export const IMPRESSIVENESS_VALUES: Record<ImpressivenessTier, number> = {
  1: 1,    // Basic
  2: 2,    // Good
  3: 3     // Impressive
};

// Tier names, descriptions, and colors
export const IMPRESSIVENESS_INFO: Record<ImpressivenessTier, { 
  name: string; 
  description: string; 
  color: string;
  bgColor: string;
}> = {
  1: { 
    name: "Basic", 
    description: "Basic habit (1 point)", 
    color: "text-blue-500",
    bgColor: "bg-blue-500"
  },
  2: { 
    name: "Good", 
    description: "Good habit (2 points)", 
    color: "text-green-500",
    bgColor: "bg-green-500"
  },
  3: { 
    name: "Impressive", 
    description: "Impressive habit (3 points)", 
    color: "text-purple-500",
    bgColor: "bg-purple-500"
  }
};

// Simple habit interface
export interface Habit {
  id: string;
  name: string;
  impressiveness: ImpressivenessTier;
  createdAt: Date;
  updatedAt: Date;
  entries: HabitEntry[];
}

// Habit entry for tracking daily completion
export interface HabitEntry {
  id: string;
  date: Date;
  completed: boolean;
  pointsEarned: number;
}

// Daily progress summary
export interface DailyProgressSummary {
  date: Date;
  totalPoints: number;
  targetPoints: number;
  habitsCompleted: number;
  totalHabits: number;
  maxPotentialPoints: number;
  tierBreakdown: Record<ImpressivenessTier, number>;
}

// Weekly summary interface
export interface WeeklySummary {
  id: number;
  userId: number;
  weekStartDate: string;
  weekEndDate: string;
  totalSimpleHabitsCompleted: number;
  totalImpressivenessPoints: number;
  totalImpressivenessHabitsCompleted: number;
  averageDailyPoints: number;
  bestDay: string | null;
  bestDayPoints: number;
  createdAt: Date;
  updatedAt: Date;
}


