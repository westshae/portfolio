import { create } from 'zustand';
import { simpleHabitsApi, impressivenessHabitsApi, summariesApi, WeeklySummaryResponse } from '@/lib/api';
import { Habit, ImpressivenessTier } from '@/types/habits';

// Types for the store
interface SimpleHabit {
  id: string;
  name: string;
  completedToday: boolean;
  createdAt: Date;
}

interface HabitsState {
  // Data
  simpleHabits: SimpleHabit[];
  impressivenessHabits: Habit[];
  weeklySummary: WeeklySummaryResponse | null;
  
  // Loading states
  simpleHabitsLoading: boolean;
  impressivenessHabitsLoading: boolean;
  summaryLoading: boolean;
  
  // Error states
  simpleHabitsError: string | null;
  impressivenessHabitsError: string | null;
  summaryError: string | null;
  
  // Actions
  loadAllData: () => Promise<void>;
  loadSimpleHabits: () => Promise<void>;
  loadImpressivenessHabits: () => Promise<void>;
  loadWeeklySummary: () => Promise<void>;
  
  // Simple habits actions
  addSimpleHabit: (name: string) => Promise<void>;
  updateSimpleHabit: (id: string, updates: { name?: string; completedToday?: boolean }) => Promise<void>;
  deleteSimpleHabit: (id: string) => Promise<void>;
  
  // Impressiveness habits actions
  addImpressivenessHabit: (name: string, impressiveness: ImpressivenessTier) => Promise<void>;
  updateImpressivenessHabit: (id: string, updates: { name?: string; impressiveness?: ImpressivenessTier }) => Promise<void>;
  deleteImpressivenessHabit: (id: string) => Promise<void>;
  updateImpressivenessHabitEntry: (habitId: string, date: string, completed: boolean) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  // Initial state
  simpleHabits: [],
  impressivenessHabits: [],
  weeklySummary: null,
  
  
  simpleHabitsLoading: false,
  impressivenessHabitsLoading: false,
  summaryLoading: false,
  
  
  simpleHabitsError: null,
  impressivenessHabitsError: null,
  summaryError: null,
  
  
  // Load all data at once
  loadAllData: async () => {
    const { loadSimpleHabits, loadImpressivenessHabits, loadWeeklySummary } = get();
    
    // Load all data in parallel for better performance
    await Promise.all([
      loadSimpleHabits(),
      loadImpressivenessHabits(),
      loadWeeklySummary()
    ]);
  },
  // Load weekly summary
  loadWeeklySummary: async () => {
    set({ summaryLoading: true, summaryError: null });
    try {
      const summary = await summariesApi.getWeeklySummary();
      set({ weeklySummary: summary });
    } catch (error) {
      console.error('Error loading weekly summary:', error);
      set({ summaryError: 'Failed to load weekly summary' });
    } finally {
      set({ summaryLoading: false });
    }
  },
  
  // Load simple habits
  loadSimpleHabits: async () => {
    set({ simpleHabitsLoading: true, simpleHabitsError: null });
    
    try {
      const apiHabits = await simpleHabitsApi.getAll();
      
      const convertedHabits: SimpleHabit[] = apiHabits.map(apiHabit => ({
        id: apiHabit.id.toString(),
        name: apiHabit.name,
        completedToday: apiHabit.completedToday,
        createdAt: new Date(apiHabit.createdAt)
      }));
      
      set({ simpleHabits: convertedHabits });
    } catch (error) {
      console.error('Error loading simple habits:', error);
      set({ simpleHabitsError: 'Failed to load simple habits' });
    } finally {
      set({ simpleHabitsLoading: false });
    }
  },
  
  // Load impressiveness habits
  loadImpressivenessHabits: async () => {
    set({ impressivenessHabitsLoading: true, impressivenessHabitsError: null });
    
    try {
      const apiHabits = await impressivenessHabitsApi.getAll();
      
      const convertedHabits: Habit[] = apiHabits.map(apiHabit => ({
        id: apiHabit.id.toString(),
        name: apiHabit.name,
        impressiveness: apiHabit.impressiveness as ImpressivenessTier,
        createdAt: new Date(apiHabit.createdAt),
        updatedAt: new Date(apiHabit.updatedAt),
        entries: apiHabit.entries.map(entry => ({
          id: entry.id,
          date: new Date(entry.date),
          completed: entry.completed,
          pointsEarned: entry.pointsEarned
        }))
      }));
      
      set({ impressivenessHabits: convertedHabits });
    } catch (error) {
      console.error('Error loading impressiveness habits:', error);
      set({ impressivenessHabitsError: 'Failed to load impressiveness habits' });
    } finally {
      set({ impressivenessHabitsLoading: false });
    }
  },
  
  
  
  // Simple habits actions
  addSimpleHabit: async (name: string) => {
    try {
      const newApiHabit = await simpleHabitsApi.create(name);
      
      const newHabit: SimpleHabit = {
        id: newApiHabit.id.toString(),
        name: newApiHabit.name,
        completedToday: newApiHabit.completedToday,
        createdAt: new Date(newApiHabit.createdAt)
      };
      
      set(state => ({
        simpleHabits: [...state.simpleHabits, newHabit]
      }));
    } catch (error) {
      console.error('Error creating simple habit:', error);
      set({ simpleHabitsError: 'Failed to create simple habit' });
    }
  },
  
  updateSimpleHabit: async (id: string, updates: { name?: string; completedToday?: boolean }) => {
    const { simpleHabits } = get();
    const habit = simpleHabits.find(h => h.id === id);
    if (!habit) return;
    
    // Optimistic update
    set(state => ({
      simpleHabits: state.simpleHabits.map(h =>
        h.id === id ? { ...h, ...updates } : h
      )
    }));
    
    try {
      const updatedHabit = await simpleHabitsApi.update(parseInt(id), updates);
      
      // Update with server data
      set(state => ({
        simpleHabits: state.simpleHabits.map(h =>
          h.id === id
            ? {
                ...h,
                name: updatedHabit.name,
                completedToday: updatedHabit.completedToday
              }
            : h
        )
      }));
    } catch (error) {
      console.error('Error updating simple habit:', error);
      set({ simpleHabitsError: 'Failed to update simple habit' });
      
      // Revert optimistic update
      set(state => ({
        simpleHabits: state.simpleHabits.map(h =>
          h.id === id ? habit : h
        )
      }));
    }
  },
  
  deleteSimpleHabit: async (id: string) => {
    const { simpleHabits } = get();
    const habit = simpleHabits.find(h => h.id === id);
    if (!habit) return;
    
    // Optimistic update
    set(state => ({
      simpleHabits: state.simpleHabits.filter(h => h.id !== id)
    }));
    
    try {
      await simpleHabitsApi.delete(parseInt(id));
    } catch (error) {
      console.error('Error deleting simple habit:', error);
      set({ simpleHabitsError: 'Failed to delete simple habit' });
      
      // Revert optimistic update
      set(state => ({
        simpleHabits: [...state.simpleHabits, habit]
      }));
    }
  },
  
  // Impressiveness habits actions
  addImpressivenessHabit: async (name: string, impressiveness: ImpressivenessTier) => {
    try {
      const newApiHabit = await impressivenessHabitsApi.create(name, impressiveness);
      
      const newHabit: Habit = {
        id: newApiHabit.id.toString(),
        name: newApiHabit.name,
        impressiveness: newApiHabit.impressiveness as ImpressivenessTier,
        createdAt: new Date(newApiHabit.createdAt),
        updatedAt: new Date(newApiHabit.updatedAt),
        entries: []
      };
      
      set(state => ({
        impressivenessHabits: [...state.impressivenessHabits, newHabit]
      }));
    } catch (error) {
      console.error('Error creating impressiveness habit:', error);
      set({ impressivenessHabitsError: 'Failed to create impressiveness habit' });
    }
  },
  
  updateImpressivenessHabit: async (id: string, updates: { name?: string; impressiveness?: ImpressivenessTier }) => {
    const { impressivenessHabits } = get();
    const habit = impressivenessHabits.find(h => h.id === id);
    if (!habit) return;
    
    // Optimistic update
    set(state => ({
      impressivenessHabits: state.impressivenessHabits.map(h =>
        h.id === id ? { ...h, ...updates, updatedAt: new Date() } : h
      )
    }));
    
    try {
      const updatedHabit = await impressivenessHabitsApi.update(parseInt(id), updates);
      
      // Update with server data
      set(state => ({
        impressivenessHabits: state.impressivenessHabits.map(h =>
          h.id === id
            ? {
                ...h,
                name: updatedHabit.name,
                impressiveness: updatedHabit.impressiveness as ImpressivenessTier,
                updatedAt: new Date(updatedHabit.updatedAt)
              }
            : h
        )
      }));
    } catch (error) {
      console.error('Error updating impressiveness habit:', error);
      set({ impressivenessHabitsError: 'Failed to update impressiveness habit' });
      
      // Revert optimistic update
      set(state => ({
        impressivenessHabits: state.impressivenessHabits.map(h =>
          h.id === id ? habit : h
        )
      }));
    }
  },
  
  deleteImpressivenessHabit: async (id: string) => {
    const { impressivenessHabits } = get();
    const habit = impressivenessHabits.find(h => h.id === id);
    if (!habit) return;
    
    // Optimistic update
    set(state => ({
      impressivenessHabits: state.impressivenessHabits.filter(h => h.id !== id)
    }));
    
    try {
      await impressivenessHabitsApi.delete(parseInt(id));
    } catch (error) {
      console.error('Error deleting impressiveness habit:', error);
      set({ impressivenessHabitsError: 'Failed to delete impressiveness habit' });
      
      // Revert optimistic update
      set(state => ({
        impressivenessHabits: [...state.impressivenessHabits, habit]
      }));
    }
  },
  
  updateImpressivenessHabitEntry: async (habitId: string, date: string, completed: boolean) => {
    const { impressivenessHabits } = get();
    const habit = impressivenessHabits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = new Date(date);
    const tempId = `temp-${Date.now()}`;
    const pointsEarned = completed ? (habit.impressiveness === 1 ? 5 : habit.impressiveness === 2 ? 10 : 20) : 0;
    
    // Find existing entry for the date
    const existingEntryIndex = habit.entries.findIndex(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const entryDateString = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`;
      return entryDateString === date;
    });
    
    // Optimistic update
    set(state => ({
      impressivenessHabits: state.impressivenessHabits.map(h => {
        if (h.id === habitId) {
          const newEntries = [...h.entries];
          
          if (existingEntryIndex >= 0) {
            // Update existing entry
            newEntries[existingEntryIndex] = {
              ...newEntries[existingEntryIndex],
              completed,
              pointsEarned
            };
          } else {
            // Add new entry with temp ID
            newEntries.push({
              id: tempId,
              date: today,
              completed,
              pointsEarned
            });
          }
          
          return {
            ...h,
            entries: newEntries,
            updatedAt: new Date()
          };
        }
        return h;
      })
    }));
    
    try {
      const updatedEntry = await impressivenessHabitsApi.updateEntry(parseInt(habitId), date, completed);
      
      // Update with server data
      set(state => ({
        impressivenessHabits: state.impressivenessHabits.map(h => {
          if (h.id === habitId) {
            const newEntries = [...h.entries];
            
            // Find the entry to update by temp ID or existing entry
            let entryToUpdateIndex = -1;
            if (existingEntryIndex >= 0) {
              entryToUpdateIndex = existingEntryIndex;
            } else {
              // Find the temp entry we just added
              entryToUpdateIndex = newEntries.findIndex(entry => entry.id === tempId);
            }
            
            if (entryToUpdateIndex >= 0) {
              // Replace with server data
              newEntries[entryToUpdateIndex] = {
                id: updatedEntry.id.toString(),
                date: new Date(updatedEntry.date),
                completed: updatedEntry.completed,
                pointsEarned: updatedEntry.pointsEarned
              };
            }
            
            return {
              ...h,
              entries: newEntries,
              updatedAt: new Date()
            };
          }
          return h;
        })
      }));
    } catch (error) {
      console.error('Error updating habit entry:', error);
      set({ impressivenessHabitsError: 'Failed to update habit entry' });
      
      // Revert optimistic update
      set(state => ({
        impressivenessHabits: state.impressivenessHabits.map(h => {
          if (h.id === habitId) {
            const newEntries = [...h.entries];
            
            if (existingEntryIndex >= 0) {
              // Revert existing entry to previous state
              newEntries[existingEntryIndex] = {
                ...newEntries[existingEntryIndex],
                completed: !completed,
                pointsEarned: !completed ? (habit.impressiveness === 1 ? 5 : habit.impressiveness === 2 ? 10 : 20) : 0
              };
            } else {
              // Remove the temp entry we added
              const tempEntryIndex = newEntries.findIndex(entry => entry.id === tempId);
              if (tempEntryIndex >= 0) {
                newEntries.splice(tempEntryIndex, 1);
              }
            }
            
            return {
              ...h,
              entries: newEntries,
              updatedAt: new Date()
            };
          }
          return h;
        })
      }));
    }
  }
}));
