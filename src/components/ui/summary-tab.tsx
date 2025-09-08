"use client";

import { Card } from "./card";
import { Button } from "./button";
import { useHabitsStore } from "@/store/habitsStore";

interface SummaryTabProps {
  className?: string;
}

export function SummaryTab({ className }: SummaryTabProps) {
  const { weeklySummary, summaryLoading, summaryError, loadWeeklySummary } = useHabitsStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (summaryLoading) {
    return (
      <div className={className}>
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">Loading summary...</p>
        </div>
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className={className}>
        <div className="text-center py-6">
          <p className="text-sm text-red-500">{summaryError}</p>
        </div>
      </div>
    );
  }

  if (!weeklySummary) {
    return (
      <div className={className}>
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm text-foreground">No summary data available</p>
          <p className="text-xs text-muted-foreground">Start tracking habits to see your summary!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-lg font-semibold text-white">Weekly Summary</h2>
            <p className="text-sm text-muted-foreground">
              {formatDate(weeklySummary.weekStart)} - {formatDate(weeklySummary.weekEnd)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadWeeklySummary()}
            disabled={summaryLoading}
          >
            {summaryLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {weeklySummary.simpleHabitsAvgPerDay}
            </div>
            <div className="text-xs text-muted-foreground">Simple Habits</div>
            <div className="text-xs text-muted-foreground">Avg per day</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {weeklySummary.growthPointsAvgPerDay}
            </div>
            <div className="text-xs text-muted-foreground">Growth Points</div>
            <div className="text-xs text-muted-foreground">Avg per day</div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="text-sm font-medium mb-2">Most Skipped Simple Habits</div>
          <div className="space-y-1 text-sm text-muted-foreground">
            {weeklySummary.mostSkippedSimpleHabits.length === 0 && (
              <div>No data</div>
            )}
            {weeklySummary.mostSkippedSimpleHabits.map(h => (
              <div key={`s-${h.id}`} className="flex justify-between">
                <span>{h.name}</span>
                <span>{h.skippedCount}/{h.consideredDays}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm font-medium mb-2">Most Skipped Growth Habits</div>
          <div className="space-y-1 text-sm text-muted-foreground">
            {weeklySummary.mostSkippedGrowthHabits.length === 0 && (
              <div>No data</div>
            )}
            {weeklySummary.mostSkippedGrowthHabits.map(h => (
              <div key={`g-${h.id}`} className="flex justify-between">
                <span>{h.name}</span>
                <span>{h.skippedCount}/{h.consideredDays}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}