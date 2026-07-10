
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Smile, Frown, Meh, AlertTriangle, Heart, BookOpen, Music, Sun, CheckCircle2, Calendar } from "lucide-react";

type Mood = "great" | "good" | "okay" | "bad" | "awful";
type Period = "week" | "month" | "year";

interface MoodEntry {
  id: string;
  mood: Mood;
  notes: string;
  date: Date;
  factors: string[];
}

// Get mood icon based on mood value
const getMoodIcon = (mood: Mood, size = 24) => {
  switch (mood) {
    case "great":
      return <Smile className="text-green-500" style={{ width: size, height: size }} />;
    case "good":
      return <Smile className="text-emerald-400" style={{ width: size, height: size }} />;
    case "okay":
      return <Meh className="text-blue-400" style={{ width: size, height: size }} />;
    case "bad":
      return <Frown className="text-orange-400" style={{ width: size, height: size }} />;
    case "awful":
      return <Frown className="text-red-500" style={{ width: size, height: size }} />;
    default:
      return <Meh style={{ width: size, height: size }} />;
  }
};

// Get mood value (number) for charts
const getMoodValue = (mood: Mood): number => {
  switch (mood) {
    case "great": return 5;
    case "good": return 4;
    case "okay": return 3;
    case "bad": return 2;
    case "awful": return 1;
    default: return 3;
  }
};

// Format date for display
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function MoodTracker() {
  const [mood, setMood] = useState<Mood>("okay");
  const [notes, setNotes] = useState("");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  
  // Initialize with some sample data
  useEffect(() => {
    const today = new Date();
    const sampleEntries: MoodEntry[] = [];
    
    // Generate sample data for the past month
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Skip some days to make it more realistic
      if (i % 3 === 0 && i > 7) continue;
      
      const moods: Mood[] = ["great", "good", "okay", "bad", "awful"];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      
      const factors = ["sleep", "exercise", "nutrition", "stress", "social"];
      const randomFactors = factors
        .filter(() => Math.random() > 0.7)
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      sampleEntries.push({
        id: `sample-${i}`,
        mood: randomMood,
        notes: "",
        date,
        factors: randomFactors,
      });
    }
    
    setMoodEntries(sampleEntries);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      notes,
      date: new Date(),
      factors: selectedFactors,
    };
    
    setMoodEntries([...moodEntries, newEntry]);
    setMood("okay");
    setNotes("");
    setSelectedFactors([]);
    
    toast.success("Mood tracked successfully!");
  };
  
  const toggleFactor = (factor: string) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter((f) => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };
  
  // Filter entries based on selected period
  const getFilteredEntries = (): MoodEntry[] => {
    const today = new Date();
    const cutoffDate = new Date();
    
    if (selectedPeriod === "week") {
      cutoffDate.setDate(today.getDate() - 7);
    } else if (selectedPeriod === "month") {
      cutoffDate.setMonth(today.getMonth() - 1);
    } else {
      cutoffDate.setFullYear(today.getFullYear() - 1);
    }
    
    return moodEntries.filter((entry) => entry.date >= cutoffDate);
  };
  
  // Prepare chart data
  const getChartData = () => {
    const filteredEntries = getFilteredEntries();
    
    return filteredEntries.map((entry) => ({
      date: formatDate(entry.date),
      moodValue: getMoodValue(entry.mood),
      mood: entry.mood,
    }));
  };
  
  // Calculate average mood
  const getAverageMood = (): number => {
    const filteredEntries = getFilteredEntries();
    if (filteredEntries.length === 0) return 0;
    
    const sum = filteredEntries.reduce(
      (acc, entry) => acc + getMoodValue(entry.mood),
      0
    );
    
    return parseFloat((sum / filteredEntries.length).toFixed(1));
  };
  
  // Generate mood insights
  const getMoodInsights = (): string[] => {
    const filteredEntries = getFilteredEntries();
    if (filteredEntries.length < 3) {
      return ["Track your mood for a few more days to get personalized insights."];
    }
    
    const insights: string[] = [];
    const avgMood = getAverageMood();
    
    // Average mood insight
    if (avgMood >= 4) {
      insights.push("Your average mood has been quite positive. Keep up the good work!");
    } else if (avgMood >= 3) {
      insights.push("Your mood has been fairly stable. Consider adding more activities you enjoy to boost it further.");
    } else {
      insights.push("Your mood has been lower than ideal. Consider speaking with a wellness professional for support.");
    }
    
    // Mood patterns
    const hasLowMoodPattern = filteredEntries.filter((entry) => getMoodValue(entry.mood) <= 2).length >= 3;
    if (hasLowMoodPattern) {
      insights.push("You've had several low mood days recently. Paying attention to sleep and exercise might help improve this pattern.");
    }
    
    // Factor correlations (simplified for demo)
    const factorCounts: Record<string, { count: number; moodSum: number }> = {};
    
    filteredEntries.forEach((entry) => {
      entry.factors.forEach((factor) => {
        if (!factorCounts[factor]) {
          factorCounts[factor] = { count: 0, moodSum: 0 };
        }
        factorCounts[factor].count += 1;
        factorCounts[factor].moodSum += getMoodValue(entry.mood);
      });
    });
    
    // Find factors that correlate with good moods
    const goodFactors = Object.entries(factorCounts)
      .filter(([_, data]) => data.count >= 2 && data.moodSum / data.count >= 4)
      .map(([factor]) => factor);
    
    if (goodFactors.length > 0) {
      insights.push(`You tend to feel better on days when you mention ${goodFactors.join(", ")}. Consider prioritizing these factors.`);
    }
    
    return insights;
  };
  
  // Get personalized recommendations
  const getRecommendations = (): string[] => {
    const avgMood = getAverageMood();
    const recommendations: string[] = [];
    
    if (avgMood < 3) {
      recommendations.push("Try a 5-minute mindfulness meditation each morning");
      recommendations.push("Consider speaking with a mental health professional");
      recommendations.push("Ensure you're getting 7-9 hours of sleep each night");
    } else if (avgMood < 4) {
      recommendations.push("Add a daily 15-minute walk in nature to your routine");
      recommendations.push("Practice gratitude by noting 3 positive things each day");
      recommendations.push("Connect with a friend or loved one at least once a day");
    } else {
      recommendations.push("Maintain your positive habits and share them with others");
      recommendations.push("Challenge yourself with new wellness activities");
      recommendations.push("Celebrate your successes, even the small ones");
    }
    
    return recommendations;
  };

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mood Tracker</h1>
          <p className="text-muted-foreground">
            Monitor your emotions and discover patterns to improve your well-being
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Log Mood Card */}
          <Card className="border-none shadow-sm md:col-span-1">
            <CardHeader>
              <CardTitle>Log Today's Mood</CardTitle>
              <CardDescription>How are you feeling today?</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Select your mood:</span>
                  <div className="grid grid-cols-5 gap-2">
                    {(["great", "good", "okay", "bad", "awful"] as Mood[]).map((moodOption) => (
                      <Button
                        key={moodOption}
                        type="button"
                        variant={mood === moodOption ? "default" : "outline"}
                        className="flex flex-col items-center p-3 h-auto"
                        onClick={() => setMood(moodOption)}
                      >
                        {getMoodIcon(moodOption, 20)}
                        <span className="text-xs mt-1 capitalize">{moodOption}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">What factors affected your mood today?</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "sleep", label: "Sleep", icon: <Moon className="h-3 w-3" /> },
                      { id: "exercise", label: "Exercise", icon: <Dumbbell className="h-3 w-3" /> },
                      { id: "nutrition", label: "Nutrition", icon: <Apple className="h-3 w-3" /> },
                      { id: "stress", label: "Stress", icon: <AlertTriangle className="h-3 w-3" /> },
                      { id: "social", label: "Social", icon: <Users className="h-3 w-3" /> },
                      { id: "work", label: "Work", icon: <Briefcase className="h-3 w-3" /> },
                      { id: "outdoors", label: "Outdoors", icon: <Sun className="h-3 w-3" /> },
                      { id: "creative", label: "Creative", icon: <Palette className="h-3 w-3" /> },
                    ].map((factor) => (
                      <Button
                        key={factor.id}
                        type="button"
                        variant={selectedFactors.includes(factor.id) ? "default" : "outline"}
                        size="sm"
                        className="flex items-center gap-1 text-xs h-7"
                        onClick={() => toggleFactor(factor.id)}
                      >
                        {factor.icon}
                        {factor.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Notes (optional):</span>
                  <Textarea
                    placeholder="Add any details about your day..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Save Mood Entry
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Mood Trends & Insights Card */}
          <Card className="border-none shadow-sm md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mood Trends</CardTitle>
                <CardDescription>Track your emotional patterns over time</CardDescription>
              </div>
              <Select
                value={selectedPeriod}
                onValueChange={(value) => setSelectedPeriod(value as Period)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList className="mb-4">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => {
                            // Shorten to just the day for week view
                            if (selectedPeriod === "week") {
                              return value.split(",")[0];
                            }
                            return value;
                          }}
                        />
                        <YAxis 
                          domain={[0, 5]} 
                          ticks={[1, 2, 3, 4, 5]} 
                          tickFormatter={(value) => {
                            const labels = ["", "Awful", "Bad", "Okay", "Good", "Great"];
                            return labels[value];
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            const labels = ["", "Awful", "Bad", "Okay", "Good", "Great"];
                            return [labels[value as number], "Mood"];
                          }}
                        />
                        <Bar 
                          dataKey="moodValue" 
                          name="Mood" 
                          fill="#9b87f5"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Average Mood</p>
                        <p className="text-lg font-bold">{getAverageMood()}/5</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Entries</p>
                        <p className="text-lg font-bold">{getFilteredEntries().length}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="insights">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Your Mood Insights</h3>
                      <ul className="space-y-2">
                        {getMoodInsights().map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Heart className="h-4 w-4 text-accent mt-1" />
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {getRecommendations().map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <BookOpen className="h-4 w-4 text-primary mt-1" />
                            <span className="text-sm">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        Mood-Boosting Playlist
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">Music tailored to help improve your current emotional state.</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Listen Now
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="space-y-4 max-h-[350px] overflow-auto pr-2">
                    {getFilteredEntries()
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map((entry) => (
                        <div key={entry.id} className="flex items-start gap-3 border-b pb-3">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                            {getMoodIcon(entry.mood)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="font-medium capitalize">{entry.mood}</p>
                              <p className="text-sm text-muted-foreground">
                                {entry.date.toLocaleDateString()}
                              </p>
                            </div>
                            {entry.factors.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {entry.factors.map((factor) => (
                                  <span
                                    key={factor}
                                    className="inline-flex items-center text-xs bg-muted px-2 py-0.5 rounded-full"
                                  >
                                    {factor}
                                  </span>
                                ))}
                              </div>
                            )}
                            {entry.notes && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {entry.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function Moon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function Apple(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22a5 5 0 0 1-5-5c0-2.76 2.5-5 5-5s5 2.24 5 5a5 5 0 0 1-5 5Z" />
      <path d="M12 12V6.5" />
      <path d="M10 10.5c-2.6-2.4-4-5.3-4-8.5h8c0 3.2-1.4 6.1-4 8.5Z" />
    </svg>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Briefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function Dumbbell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18 22 4-4" />
      <path d="m2 6 4-4" />
      <path d="m3 10 7-7" />
      <path d="m14 21 7-7" />
    </svg>
  );
}

function Palette(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}
