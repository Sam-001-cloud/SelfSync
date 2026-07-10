
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Layout from "@/components/Layout";
import Logo from "@/components/Logo";
import { 
  ArrowRight, 
  Heart, 
  Sparkles, 
  MessageSquare, 
  BarChart3, 
  Bell, 
  Award
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Layout hideNav>
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Logo size="md" />
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
              <Button onClick={() => navigate("/register")}>Get Started</Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex-1 py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/40">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter gradient-text">
                Your Journey to Wellness Begins with Self<span className="text-secondary">Sync</span>
              </h1>
              <p className="text-muted-foreground text-xl max-w-[700px] mx-auto">
                Personalized self-care reminders, AI-powered health advice, and habit tracking to keep you balanced, mindful, and thriving.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
              <Button size="lg" className="rounded-full" onClick={() => navigate("/register")}>
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
            
            <div className="relative w-full max-w-5xl mt-12 md:mt-16">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-24 bottom-0 top-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-0">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 card-hover">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Self-Care Reminders</h3>
                  <p className="text-muted-foreground">Never forget your wellness routines with customizable reminders.</p>
                </div>
                
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl p-6 card-hover">
                  <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Health Assistant</h3>
                  <p className="text-muted-foreground">Get personalized advice and answers to your wellness questions.</p>
                </div>
                
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-6 card-hover">
                  <div className="bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Mood & Habit Tracking</h3>
                  <p className="text-muted-foreground">Monitor your emotional state and build healthy habits effortlessly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-2">Enhance Your Wellness Journey</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">SelfSync offers powerful tools designed to improve your physical and mental wellbeing.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <Bell className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Smart Reminders</h3>
                <p className="text-muted-foreground">Customizable notifications for hydration, meditation, exercise, skincare, and more.</p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <MessageSquare className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-medium mb-2">AI Wellness Chat</h3>
                <p className="text-muted-foreground">Ask health questions and receive evidence-based advice tailored to your needs.</p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <Heart className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-medium mb-2">Mood Journal</h3>
                <p className="text-muted-foreground">Track your emotions, identify patterns, and gain insights into your emotional wellbeing.</p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Progress Dashboard</h3>
                <p className="text-muted-foreground">Visualize your wellness journey with interactive charts and progress indicators.</p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <Sparkles className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-medium mb-2">Daily Affirmations</h3>
                <p className="text-muted-foreground">Start your day with positive affirmations tailored to your goals and emotional state.</p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <Award className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-medium mb-2">Rewards & Gamification</h3>
                <p className="text-muted-foreground">Earn badges and rewards for maintaining your self-care routines and reaching milestones.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold tracking-tighter">Ready to Transform Your Self-Care Routine?</h2>
              <p className="text-muted-foreground">Join thousands of users who have improved their wellbeing with SelfSync.</p>
              <Button size="lg" className="rounded-full" onClick={() => navigate("/register")}>
                Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Logo className="mb-4 md:mb-0" />
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">Privacy</Button>
                <Button variant="ghost" size="sm">Terms</Button>
                <Button variant="ghost" size="sm">Contact</Button>
              </div>
              <p className="text-sm text-muted-foreground">© 2023 SelfSync. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
