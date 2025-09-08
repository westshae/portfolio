// API utility functions for habit management

export interface SimpleHabit {
  id: number;
  name: string;
  completedToday: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitEntry {
  id: string;
  date: string;
  completed: boolean;
  pointsEarned: number;
}


export interface ImpressivenessHabit {
  id: number;
  name: string;
  impressiveness: 1 | 2 | 3;
  createdAt: Date;
  updatedAt: Date;
  entries: HabitEntry[];
}

// Simple Habits API
export const simpleHabitsApi = {
  async getAll(): Promise<SimpleHabit[]> {
    const response = await fetch('/api/habits/simple');
    if (!response.ok) {
      throw new Error('Failed to fetch simple habits');
    }
    return response.json();
  },

  async create(name: string): Promise<SimpleHabit> {
    const response = await fetch('/api/habits/simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error('Failed to create simple habit');
    }
    return response.json();
  },

  async update(id: number, updates: { name?: string; completedToday?: boolean }): Promise<SimpleHabit> {
    const response = await fetch(`/api/habits/simple/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update simple habit');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`/api/habits/simple/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete simple habit');
    }
  },
};

// Impressiveness Habits API
export const impressivenessHabitsApi = {
  async getAll(): Promise<ImpressivenessHabit[]> {
    const response = await fetch('/api/habits/impressiveness');
    if (!response.ok) {
      throw new Error('Failed to fetch impressiveness habits');
    }
    return response.json();
  },

  async create(name: string, impressiveness: 1 | 2 | 3): Promise<ImpressivenessHabit> {
    const response = await fetch('/api/habits/impressiveness', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, impressiveness }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create impressiveness habit: ${response.status} ${errorText}`);
    }
    return response.json();
  },

  async update(id: number, updates: { name?: string; impressiveness?: 1 | 2 | 3 }): Promise<ImpressivenessHabit> {
    const response = await fetch(`/api/habits/impressiveness/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update impressiveness habit');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`/api/habits/impressiveness/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete impressiveness habit');
    }
  },

  async updateEntry(habitId: number, date: string, completed: boolean): Promise<HabitEntry> {
    const response = await fetch(`/api/habits/impressiveness/${habitId}/entries`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, completed }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update habit entry: ${response.status} ${errorText}`);
    }
    return response.json();
  },
};

// Weekly Summary API (new)
export interface WeeklySummaryResponse {
  weekStart: string;
  weekEnd: string;
  simpleHabitsAvgPerDay: number;
  growthPointsAvgPerDay: number;
  mostSkippedSimpleHabits: Array<{ id: number; name: string; skippedCount: number; consideredDays: number; skipRate: number }>;
  mostSkippedGrowthHabits: Array<{ id: number; name: string; skippedCount: number; consideredDays: number; skipRate: number }>;
}

export const summariesApi = {
  async getWeeklySummary(): Promise<WeeklySummaryResponse> {
    const response = await fetch('/api/summaries');
    if (!response.ok) {
      throw new Error('Failed to fetch weekly summary');
    }
    return response.json();
  },
};
