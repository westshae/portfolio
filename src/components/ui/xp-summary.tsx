"use client";

import { DailyProgressSummary, ImpressivenessTier, IMPRESSIVENESS_VALUES, IMPRESSIVENESS_INFO } from "@/types/habits";

interface XPSummaryProps {
  summary: DailyProgressSummary;
  className?: string;
}

export function XPSummary({ summary, className }: XPSummaryProps) {
  const isPositive = summary.totalPoints >= 0;

  // Use the dynamic maximum potential points from the summary
  const maxCircleXP = summary.maxPotentialPoints || 40; // Fallback to 40 if not provided
    
  // Calculate the circumference and stroke dasharray for the progress bar
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  
  // Create segments for each tier that was completed
  const tierSegments = Object.entries(summary.tierBreakdown)
    .filter(([, count]) => count > 0)
    .map(([tier, count]) => ({
      tier: parseInt(tier) as ImpressivenessTier,
      count,
      xp: IMPRESSIVENESS_VALUES[parseInt(tier) as ImpressivenessTier],
      color: IMPRESSIVENESS_INFO[parseInt(tier) as ImpressivenessTier].color,
      totalTierXP: Math.abs(IMPRESSIVENESS_VALUES[parseInt(tier) as ImpressivenessTier] * count)
    }))
    .sort((a, b) => Math.abs(b.xp) - Math.abs(a.xp)); // Sort by absolute XP value

  // Get tier colors using CSS variables - only positive tiers
  const getTierColor = (tier: ImpressivenessTier): string => {
    const colors = {
      1: "hsl(var(--primary))",          // Basic - Blue
      2: "hsl(var(--success))",          // Good - Green
      3: "hsl(var(--success))"           // Impressive - Green
    };
    return colors[tier] || "hsl(var(--muted))";
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-center">
        {/* Main Circle with Progress Bar */}
        <div className="relative">
          {/* Background Circle */}
          <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle - represents total available positive XP */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="16"
            />
            
            {/* Positive progress segments - fill the circle from 0 to their completion */}
            {tierSegments
              .filter(segment => IMPRESSIVENESS_VALUES[segment.tier] > 0)
              .map((segment, index) => {
                const fullSegmentCircumference = (segment.totalTierXP / maxCircleXP) * circumference;
                const offset = index === 0 ? 0 : 
                  tierSegments
                    .filter(s => IMPRESSIVENESS_VALUES[s.tier] > 0)
                    .slice(0, index)
                    .reduce((acc, s) => acc + (s.totalTierXP / maxCircleXP) * circumference, 0);
                
                return (
                                     <circle
                     key={`positive-${segment.tier}-${index}`}
                     cx="100"
                     cy="100"
                     r={radius}
                     fill="none"
                     stroke={getTierColor(segment.tier)}
                     strokeWidth="16"
                     strokeDasharray={`${fullSegmentCircumference} ${circumference}`}
                     strokeDashoffset={-offset}
                     transform="rotate(-90 100 100)"
                   />
                );
              })}
            
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <div 
                className={`text-3xl font-bold mb-1 ${
                  isPositive ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"
                }`}
              >
                {isPositive ? "+" : ""}{summary.totalPoints}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                XP Today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
