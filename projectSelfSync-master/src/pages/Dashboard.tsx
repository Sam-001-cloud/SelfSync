import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { HealthQuiz } from "@/components/landing/HealthQuiz";
import { HealthQuotesCarousel } from "@/components/dashboard/HealthQuotesCarousel";
import { WellnessMemoryGame } from "@/components/games/WellnessMemoryGame";
import { Certificate } from "@/components/dashboard/Certificate";
import {
  DropletIcon,
  MoonIcon,
  HeartIcon,
  StretchHorizontalIcon,
  BrainCircuitIcon,
  Sparkles,
  Award,
  BookOpen,
  Heart,
  Target,
  BarChart3,
  Dumbbell,
  Bell,
  MessageSquare,
  GamepadIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

type Reminder = {
  id: string;
  title: string;
  time: string;
  icon: React.ReactNode;
  completed: boolean;
};

type Streak = {
  activity: string;
  days: number;
  icon: React.ReactNode;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [wellnessScore, setWellnessScore] = useState(0);
  
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setWellnessScore(78);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const todayReminders = useMemo(() => [
    { id: "1", title: "Drink water", time: "Every 2 hours", icon: <DropletIcon />, completed: true },
    { id: "2", title: "Meditation", time: "9:00 AM", icon: <BrainCircuitIcon />, completed: true },
    { id: "3", title: "Stretch break", time: "11:30 AM", icon: <StretchHorizontalIcon />, completed: false },
    { id: "4", title: "Exercise", time: "5:30 PM", icon: <HeartIcon />, completed: false },
    { id: "5", title: "Sleep routine", time: "10:00 PM", icon: <MoonIcon />, completed: false },
  ], []);
  
  const streaks = useMemo(() => [
    { activity: "Meditation", days: 12, icon: <BrainCircuitIcon className="h-5 w-5 text-purple-500" /> },
    { activity: "Hydration", days: 21, icon: <DropletIcon className="h-5 w-5 text-blue-500" /> },
    { activity: "Journaling", days: 7, icon: <BookOpen className="h-5 w-5 text-amber-500" /> },
    { activity: "Exercise", days: 5, icon: <Dumbbell className="h-5 w-5 text-green-500" /> },
  ], []);
  
  const badges = useMemo(() => [
    { id: 1, name: "Early Bird", description: "Completed morning routine 7 days in a row", icon: <Sparkles className="h-8 w-8 text-amber-500" /> },
    { id: 2, name: "Hydration Hero", description: "Met daily water intake goal for 2 weeks", icon: <DropletIcon className="h-8 w-8 text-blue-500" /> },
    { id: 3, name: "Meditation Master", description: "Completed 10 meditation sessions", icon: <BrainCircuitIcon className="h-8 w-8 text-purple-500" /> },
    { id: 4, name: "Gratitude Guru", description: "Added to gratitude journal 5 days in a row", icon: <Heart className="h-8 w-8 text-rose-500" /> },
  ], []);

  const renderDashboardTab = () => (
    <TabsContent value="dashboard" className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Wellness Score
            </CardTitle>
            <CardDescription>Your overall wellness metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <div className="relative h-40 w-40">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="stroke-muted"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="8"
                  />
                  <circle
                    className="stroke-primary"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * wellnessScore) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{wellnessScore}</div>
                    <div className="text-sm text-muted-foreground">Great</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-muted-foreground text-xs">Physical</div>
                <Progress className="h-2 mt-1" value={82} />
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Mental</div>
                <Progress className="h-2 mt-1" value={75} />
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Sleep</div>
                <Progress className="h-2 mt-1" value={68} />
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Nutrition</div>
                <Progress className="h-2 mt-1" value={85} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Today's Reminders
            </CardTitle>
            <CardDescription>
              Your self-care checklist for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayReminders.slice(0, 4).map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className={`rounded-full p-1.5 ${reminder.completed ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                    {reminder.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${reminder.completed ? "line-through opacity-70" : ""}`}>
                      {reminder.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {reminder.time}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={reminder.completed}
                    className="h-5 w-5 rounded-md border-gray-300 text-primary focus:ring-primary"
                    readOnly
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="?tab=reminders">View all reminders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Your Streaks
            </CardTitle>
            <CardDescription>
              Keep up the momentum with your habits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streaks.map((streak, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {streak.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{streak.activity}</p>
                    <Progress className="h-2 mt-1" value={(streak.days / 30) * 100} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold">{streak.days}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Link to="/mood-tracker" className="group">
          <Card className="border-none shadow-sm h-full transition-all group-hover:shadow-md group-hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Mood Tracker
              </CardTitle>
              <CardDescription>Track and analyze your emotional well-being</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Log your mood to receive personalized insights.</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/journal" className="group">
          <Card className="border-none shadow-sm h-full transition-all group-hover:shadow-md group-hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Journal & Gratitude
              </CardTitle>
              <CardDescription>Record your thoughts and practice gratitude</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Enhance your well-being through journaling.</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/bmi-calculator" className="group">
          <Card className="border-none shadow-sm h-full transition-all group-hover:shadow-md group-hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartIcon className="h-5 w-5 text-red-500" />
                BMI Calculator
              </CardTitle>
              <CardDescription>Check your Body Mass Index and health</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Calculate your BMI and get recommendations.</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/relaxation" className="group">
          <Card className="border-none shadow-sm h-full transition-all group-hover:shadow-md group-hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MoonIcon className="h-5 w-5 text-blue-500" />
                Relaxation
              </CardTitle>
              <CardDescription>Find peace with guided meditation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Explore meditation and breathing exercises.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Link to="/chat">
          <Card className="relative border-none p-4 h-20 flex items-center bg-primary/10 group hover:bg-primary/20 transition-colors">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="font-medium">AI Chat</span>
            </div>
          </Card>
        </Link>
        
        <Link to="/dashboard?tab=games">
          <Card className="relative border-none p-4 h-20 flex items-center bg-amber-500/10 group hover:bg-amber-500/20 transition-colors">
            <div className="flex items-center gap-3">
              <GamepadIcon className="h-6 w-6 text-amber-500" />
              <span className="font-medium">Games</span>
            </div>
          </Card>
        </Link>
        
        <Link to="/mood-tracker">
          <Card className="relative border-none p-4 h-20 flex items-center bg-yellow-500/10 group hover:bg-yellow-500/20 transition-colors">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <span className="font-medium">Mood Log</span>
            </div>
          </Card>
        </Link>
        
        <Link to="/dashboard?tab=rewards">
          <Card className="relative border-none p-4 h-20 flex items-center bg-purple-500/10 group hover:bg-purple-500/20 transition-colors">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-purple-500" />
              <span className="font-medium">Rewards</span>
            </div>
          </Card>
        </Link>
      </div>
    </TabsContent>
  );

  const renderRemindersTab = () => (
    <TabsContent value="reminders" className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Self-Care Reminders</CardTitle>
          <CardDescription>Manage your daily wellness activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className={`rounded-full p-2 ${reminder.completed ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                  {reminder.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${reminder.completed ? "line-through opacity-70" : ""}`}>
                    {reminder.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reminder.completed}
                    className="h-5 w-5 rounded-md border-gray-300 text-primary focus:ring-primary"
                    readOnly
                  />
                  <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button className="w-full">Add New Reminder</Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );

  const renderRewardsTab = () => (
    <TabsContent value="rewards" className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
          <CardDescription>Badges and rewards you've earned on your wellness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center rounded-lg border bg-card p-4 text-center"
              >
                <div className="mb-3 rounded-full border-4 border-muted bg-background p-2">
                  {badge.icon}
                </div>
                <h3 className="text-base font-semibold">{badge.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Total Wellness Points</span>
                      <span className="text-sm font-medium">1,250 / 5,000</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Next Reward</span>
                      <span className="text-sm font-medium">75 points to go</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Upcoming Achievements</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm">Consistency Champion</p>
                          <p className="text-xs text-muted-foreground">Log in for 14 consecutive days</p>
                        </div>
                        <div className="ml-auto text-xs">3 days to go</div>
                      </li>
                      <li className="flex items-center gap-3">
                        <Dumbbell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm">Fitness Fanatic</p>
                          <p className="text-xs text-muted-foreground">Complete 20 workouts</p>
                        </div>
                        <div className="ml-auto text-xs">8 more needed</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Certificate streakDays={5} requiredDays={7} wellnessPoints={1250} />
        </CardContent>
      </Card>
    </TabsContent>
  );

  const renderGamesTab = () => (
    <TabsContent value="games" className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuitIcon className="h-5 w-5 text-purple-500" />
              Health Quiz
            </CardTitle>
            <CardDescription>Test your knowledge about health and wellness</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthQuiz />
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GamepadIcon className="h-5 w-5 text-amber-500" />
              Wellness Memory Game
            </CardTitle>
            <CardDescription>Improve your memory while learning about wellness</CardDescription>
          </CardHeader>
          <CardContent>
            <WellnessMemoryGame />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.name?.split(" ")[0] || "Friend"}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your wellness journey
          </p>
        </div>
        
        <Card className="border-none shadow-sm mb-6 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <blockquote className="text-sm md:text-base font-medium italic">
              "The greatest wealth is health."
            </blockquote>
            <cite className="text-xs md:text-sm font-medium not-italic text-muted-foreground">
              — Virgil
            </cite>
          </div>
        </Card>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
          </TabsList>
          
          {activeTab === "dashboard" && renderDashboardTab()}
          {activeTab === "reminders" && renderRemindersTab()}
          {activeTab === "rewards" && renderRewardsTab()}
          {activeTab === "games" && renderGamesTab()}
        </Tabs>
      </div>
    </Layout>
  );
}
