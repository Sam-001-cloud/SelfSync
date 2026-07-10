
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { format } from "date-fns";
import { 
  BookOpen, 
  Heart, 
  Plus, 
  Search, 
  Calendar, 
  Edit3, 
  Sparkles, 
  MoreHorizontal,
  Trash,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  type: "journal" | "gratitude" | "affirmation";
  date: Date;
  favorite: boolean;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState("journal");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  
  // Generate some sample entries
  useEffect(() => {
    const types: ("journal" | "gratitude" | "affirmation")[] = ["journal", "gratitude", "affirmation"];
    const sampleEntries: JournalEntry[] = [];
    
    // Add some sample entries from the past week
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const type = types[Math.floor(Math.random() * types.length)];
      
      let title = "";
      let content = "";
      
      if (type === "journal") {
        title = `Daily Reflection: ${format(date, "MMMM d")}`;
        content = "Today I focused on maintaining a positive mindset despite some challenges at work. I practiced deep breathing when I felt stressed, which really helped. I'm proud of how I handled the situation with patience.";
      } else if (type === "gratitude") {
        title = `Gratitude List: ${format(date, "MMMM d")}`;
        content = "1. The support from my friends\n2. Having nutritious food to eat\n3. The beautiful weather today\n4. A comfortable home\n5. Good health";
      } else {
        title = `Daily Affirmations: ${format(date, "MMMM d")}`;
        content = "I am capable of achieving my goals.\nI choose to focus on what I can control.\nI am worthy of love and respect.\nI trust my journey and embrace the process.\nI am becoming stronger every day.";
      }
      
      // Add entry (skip some days for realism)
      if (i % 2 === 0 || i === 0) {
        sampleEntries.push({
          id: `sample-${i}`,
          title,
          content,
          type,
          date,
          favorite: Math.random() > 0.7,
        });
      }
    }
    
    setEntries(sampleEntries);
  }, []);
  
  const handleNewEntry = () => {
    setEntryTitle("");
    setEntryContent("");
    setSelectedEntry(null);
    setShowNewEntry(true);
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setSelectedEntry(entry);
    setShowNewEntry(true);
  };
  
  const handleSaveEntry = () => {
    if (!entryTitle.trim()) {
      toast.error("Please add a title for your entry");
      return;
    }
    
    if (!entryContent.trim()) {
      toast.error("Please add some content for your entry");
      return;
    }
    
    if (selectedEntry) {
      // Update existing entry
      const updatedEntries = entries.map((entry) =>
        entry.id === selectedEntry.id
          ? {
              ...entry,
              title: entryTitle,
              content: entryContent,
            }
          : entry
      );
      
      setEntries(updatedEntries);
      toast.success("Entry updated successfully");
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: entryTitle,
        content: entryContent,
        type: activeTab as "journal" | "gratitude" | "affirmation",
        date: new Date(),
        favorite: false,
      };
      
      setEntries([newEntry, ...entries]);
      toast.success("Entry saved successfully");
    }
    
    setShowNewEntry(false);
    setEntryTitle("");
    setEntryContent("");
    setSelectedEntry(null);
  };
  
  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast.success("Entry deleted successfully");
  };
  
  const handleToggleFavorite = (id: string) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
    );
    
    setEntries(updatedEntries);
  };
  
  const getFilteredEntries = () => {
    return entries
      .filter((entry) => entry.type === activeTab)
      .filter((entry) =>
        searchQuery
          ? entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };
  
  const getEntryIcon = (type: string) => {
    switch (type) {
      case "journal":
        return <BookOpen className="h-4 w-4" />;
      case "gratitude":
        return <Heart className="h-4 w-4" />;
      case "affirmation":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  const getPrompt = () => {
    switch (activeTab) {
      case "journal":
        return "Reflect on your day. What went well? What challenged you? What did you learn?";
      case "gratitude":
        return "List 3-5 things you're grateful for today, no matter how small they might seem.";
      case "affirmation":
        return "Write positive affirmations that will empower and motivate you.";
      default:
        return "";
    }
  };
  
  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Journal & Gratitude</h1>
            <p className="text-muted-foreground">
              Record your thoughts, practice gratitude, and create affirmations
            </p>
          </div>
          <Button onClick={handleNewEntry}>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
        
        {showNewEntry ? (
          <Card className="border-none shadow-sm animate-fade-in">
            <CardHeader>
              <CardTitle>
                {selectedEntry ? "Edit Entry" : `New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Entry`}
              </CardTitle>
              <CardDescription>{getPrompt()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your entry"
                    value={entryTitle}
                    onChange={(e) => setEntryTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Start writing..."
                    value={entryContent}
                    onChange={(e) => setEntryContent(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewEntry(false);
                      setSelectedEntry(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEntry}>Save Entry</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="journal" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="journal" className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>Journal</span>
                  </TabsTrigger>
                  <TabsTrigger value="gratitude" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>Gratitude</span>
                  </TabsTrigger>
                  <TabsTrigger value="affirmation" className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    <span>Affirmations</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    className="pl-9 w-full sm:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <TabsContent value="journal" className="mt-6">
                <JournalEntryList
                  entries={getFilteredEntries()}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                  onToggleFavorite={handleToggleFavorite}
                />
              </TabsContent>
              
              <TabsContent value="gratitude" className="mt-6">
                <JournalEntryList
                  entries={getFilteredEntries()}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                  onToggleFavorite={handleToggleFavorite}
                />
              </TabsContent>
              
              <TabsContent value="affirmation" className="mt-6">
                <JournalEntryList
                  entries={getFilteredEntries()}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                  onToggleFavorite={handleToggleFavorite}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <p className="text-sm text-muted-foreground">Page 1 of 1</p>
              <Button variant="outline" size="sm" className="gap-1">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

interface JournalEntryListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

function JournalEntryList({ entries, onEdit, onDelete, onToggleFavorite }: JournalEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No entries found</h3>
        <p className="text-muted-foreground max-w-md">
          Start writing to create your first entry or try a different search term.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <Card
          key={entry.id}
          className={`border-none shadow-sm hover:shadow transition-shadow ${
            entry.favorite ? "ring-1 ring-primary/20" : ""
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {entry.type === "journal" && <BookOpen className="h-4 w-4 text-blue-500" />}
                {entry.type === "gratitude" && <Heart className="h-4 w-4 text-rose-500" />}
                {entry.type === "affirmation" && <Sparkles className="h-4 w-4 text-amber-500" />}
                <span className="text-xs text-muted-foreground">
                  {format(entry.date, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onToggleFavorite(entry.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      entry.favorite ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                </Button>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(entry)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardTitle className="text-base">{entry.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">
              {entry.content}
            </p>
            <div className="flex justify-between items-center mt-4 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-2"
                onClick={() => onEdit(entry)}
              >
                Read More
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(entry.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
