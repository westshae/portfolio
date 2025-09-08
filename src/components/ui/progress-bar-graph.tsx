"use client";

import { DailyProgressSummary, ImpressivenessTier, IMPRESSIVENESS_VALUES, IMPRESSIVENESS_INFO } from "@/types/habits";

interface ProgressBarGraphProps {
  summary: DailyProgressSummary;
  className?: string;
}

export function ProgressBarGraph({ summary, className }: ProgressBarGraphProps) {
  
  // Calculate progress percentage
  const progressPercentage = summary.maxPotentialPoints > 0 
    ? (summary.totalPoints / summary.maxPotentialPoints) * 100 
    : 0;

  // Create segments for each tier that was completed
  const tierSegments = Object.entries(summary.tierBreakdown)
    .filter(([, count]) => count > 0)
    .map(([tier, count]) => ({
      tier: parseInt(tier) as ImpressivenessTier,
      count,
      points: IMPRESSIVENESS_VALUES[parseInt(tier) as ImpressivenessTier],
      info: IMPRESSIVENESS_INFO[parseInt(tier) as ImpressivenessTier],
      totalTierPoints: IMPRESSIVENESS_VALUES[parseInt(tier) as ImpressivenessTier] * count
    }))
    .sort((a, b) => b.tier - a.tier); // Sort by tier (3, 2, 1)

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="relative">
          {/* Background Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            {/* Progress Segments */}
            <div className="flex h-full rounded-full overflow-hidden">
              {tierSegments.map((segment, index) => {
                const segmentWidth = (segment.totalTierPoints / summary.maxPotentialPoints) * 100;
                
                return (
                  <div
                    key={`segment-${segment.tier}-${index}`}
                    className={`h-full ${segment.info.bgColor}`}
                    style={{
                      width: `${segmentWidth}%`,
                      marginLeft: index === 0 ? '0' : '0'
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Progress Text */}
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-600">
              {summary.totalPoints}/{summary.maxPotentialPoints} points
            </div>
            <div className="text-sm font-medium text-gray-900">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>

        {/* Tier Legend */}
        <div className="grid grid-cols-3 gap-2">
          {([1, 2, 3] as ImpressivenessTier[]).map((tier) => {
            const info = IMPRESSIVENESS_INFO[tier];
            const count = summary.tierBreakdown[tier] || 0;
            const points = IMPRESSIVENESS_VALUES[tier];
            
            return (
              <div key={tier} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${info.bgColor}`} />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-900">{info.name}</div>
                  <div className="text-xs text-gray-500">
                    {count} × {points} = {count * points} pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
