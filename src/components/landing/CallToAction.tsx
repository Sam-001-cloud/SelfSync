
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Start Your Wellness Journey Today</h2>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
        Track your moods, build healthy habits, and improve your well-being with SelfSync.
      </p>
      <Button size="lg" className="rounded-full" asChild>
        <Link to="/register">Get Started</Link>
      </Button>
    </div>
  );
}
