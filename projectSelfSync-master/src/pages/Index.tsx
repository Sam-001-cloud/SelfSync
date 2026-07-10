
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MemoryGame } from "@/components/MemoryGame";
import { Header } from "@/components/landing/Header";
import { MoodTracking } from "@/components/landing/MoodTracking";
import { DailyHabits } from "@/components/landing/DailyHabits";
import { DailyAffirmation } from "@/components/landing/DailyAffirmation";
import { CallToAction } from "@/components/landing/CallToAction";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <Header />
      
      {/* Main content area */}
      <main className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-8">
            <MoodTracking />
            <DailyHabits />
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            <DailyAffirmation />
            <MemoryGame />
          </div>
        </div>
        
        {/* Call to action */}
        <CallToAction />
      </main>
    </div>
  );
};

export default Index;
