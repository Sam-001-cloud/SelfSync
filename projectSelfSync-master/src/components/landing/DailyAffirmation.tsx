
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export function DailyAffirmation() {
  return (
    <Card className="bg-black/30 border-none text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Daily Affirmation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-48">
        <blockquote className="text-xl italic text-center">
          "I welcome peace into my mind and body."
        </blockquote>
        <Button variant="outline" size="sm" className="mt-6 border-white text-white hover:text-black hover:bg-white">
          <RefreshCw className="mr-2 h-4 w-4" />
          New Affirmation
        </Button>
      </CardContent>
    </Card>
  );
}
