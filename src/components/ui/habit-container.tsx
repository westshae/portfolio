"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ReactNode } from "react";

interface HabitContainerProps {
  title: ReactNode;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  onClick?: () => void;
}

export function HabitContainer({ 
  title, 
  description, 
  children, 
  className = "",
  actions,
  onClick
}: HabitContainerProps) {
  return (
    <Card 
      className={`${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-base sm:text-lg">
          <div className="break-words">{title}</div>
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </CardTitle>
        {description && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {children}
      </CardContent>
    </Card>
  );
}
