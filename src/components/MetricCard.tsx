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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {isUpdating && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live Update" />
          )}
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={`text-2xl font-bold transition-all duration-300 ${
            isUpdating ? 'text-primary' : 'text-foreground'
          }`}>
            {value}
          </div>
          <Badge
            variant={changeType === "positive" ? "default" : "destructive"}
            className={`flex items-center gap-1 transition-all duration-300 ${
              isUpdating ? 'scale-110' : ''
            }`}
          >
            {changeType === "positive" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}