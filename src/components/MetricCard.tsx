import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
}

export function MetricCard({ title, value, change, changeType, icon: Icon }: MetricCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousValue, setPreviousValue] = useState(value);

  // Show update animation when value changes
  useEffect(() => {
    if (value !== previousValue) {
      setIsUpdating(true);
      setPreviousValue(value);
      
      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 1000); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  return (
    <Card className={`group bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:bg-gradient-to-br hover:from-card/90 hover:to-primary/5 ${
      isUpdating ? 'ring-2 ring-primary/30 shadow-lg transform scale-[1.02]' : ''
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 truncate pr-2">
          {title}
        </CardTitle>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {isUpdating && (
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" title="Live Update" />
          )}
          <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className={`text-xl sm:text-2xl font-bold transition-all duration-300 truncate ${
            isUpdating ? 'text-primary' : 'text-foreground'
          }`}>
            {value}
          </div>
          <Badge
            variant={changeType === "positive" ? "default" : "destructive"}
            className={`flex items-center gap-1 transition-all duration-300 text-xs h-6 self-start sm:self-center ${
              isUpdating ? 'scale-110' : ''
            }`}
          >
            {changeType === "positive" ? (
              <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            )}
            <span className="font-medium">{change}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}