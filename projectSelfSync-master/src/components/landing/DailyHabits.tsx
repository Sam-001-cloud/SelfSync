
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export function DailyHabits() {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daily Habits</h2>
        <Button variant="ghost" size="sm">
          <span>Add</span>
          <span className="ml-1">+</span>
        </Button>
      </div>
      <div className="text-sm text-muted-foreground mb-4">0% completed today</div>
      <Card className="bg-black/30 border-none">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-primary" />
                <span className="text-white">Drink water</span>
              </div>
              <Button variant="ghost" size="icon" className="text-white">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-primary" />
                <span className="text-white">Meditate</span>
              </div>
              <Button variant="ghost" size="icon" className="text-white">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-primary" />
                <span className="text-white">Exercise</span>
              </div>
              <Button variant="ghost" size="icon" className="text-white">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
