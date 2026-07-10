
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import {
  Play,
  Pause,
  Volume2,
  Music,
  Leaf,
  Waves,
  Cloud,
  Wind,
  Coffee,
  Flame,
  Moon,
  Timer,
  AlertTriangle,
  VolumeX,
} from "lucide-react";

interface Sound {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: "nature" | "ambient" | "white" | "sleep";
  audioSrc: string;
}

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  steps: { seconds: number; instruction: string }[];
  benefits: string[];
}

// Class to manage audio players
class AudioManager {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  
  // Load an audio element
  load(id: string, src: string): void {
    if (!this.audioElements.has(id)) {
      const audio = new Audio(src);
      audio.loop = true;
      this.audioElements.set(id, audio);
    }
  }
  
  // Play audio
  play(id: string): void {
    const audio = this.audioElements.get(id);
    if (audio) {
      audio.play().catch(err => {
        console.error("Failed to play audio:", err);
        toast.error("Failed to play audio. Try clicking again.");
      });
    }
  }
  
  // Pause audio
  pause(id: string): void {
    const audio = this.audioElements.get(id);
    if (audio) {
      audio.pause();
    }
  }
  
  // Set volume
  setVolume(id: string, volume: number): void {
    const audio = this.audioElements.get(id);
    if (audio) {
      audio.volume = volume / 100;
    }
  }
  
  // Pause all audio
  pauseAll(): void {
    this.audioElements.forEach(audio => {
      audio.pause();
    });
  }
  
  // Set volume for all
  setVolumeAll(volume: number): void {
    this.audioElements.forEach(audio => {
      audio.volume = volume / 100;
    });
  }
  
  // Clean up
  cleanup(): void {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.src = "";
    });
    this.audioElements.clear();
  }
}

export default function Relaxation() {
  const [activeTab, setActiveTab] = useState("sounds");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [activeSoundIds, setActiveSoundIds] = useState<string[]>([]);
  const [activeExercise, setActiveExercise] = useState<BreathingExercise | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [breathingSeconds, setBreathingSeconds] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioManagerRef = useRef<AudioManager>(new AudioManager());
  
  const sounds: Sound[] = [
    { id: "rain", name: "Rain", icon: <Cloud />, category: "nature", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/nature/rain.mp3" },
    { id: "thunder", name: "Thunder Storm", icon: <Cloud />, category: "nature", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/nature/thunder.mp3" },
    { id: "forest", name: "Forest", icon: <Leaf />, category: "nature", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/nature/forest.mp3" },
    { id: "waves", name: "Ocean Waves", icon: <Waves />, category: "nature", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/nature/waves.mp3" },
    { id: "wind", name: "Wind", icon: <Wind />, category: "nature", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/nature/wind.mp3" },
    { id: "fire", name: "Fireplace", icon: <Flame />, category: "ambient", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/ambient/fire.mp3" },
    { id: "cafe", name: "Cafe", icon: <Coffee />, category: "ambient", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/ambient/cafe.mp3" },
    { id: "white", name: "White Noise", icon: <VolumeX />, category: "white", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/noise/white.mp3" },
    { id: "pink", name: "Pink Noise", icon: <VolumeX />, category: "white", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/noise/pink.mp3" },
    { id: "brown", name: "Brown Noise", icon: <VolumeX />, category: "white", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/noise/brown.mp3" },
    { id: "sleep", name: "Sleep Music", icon: <Moon />, category: "sleep", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/sleep/sleep.mp3" },
    { id: "lullaby", name: "Lullaby", icon: <Music />, category: "sleep", audioSrc: "https://relaxing-sounds.s3.amazonaws.com/sleep/lullaby.mp3" },
  ];
  
  // Load audio on mount
  useEffect(() => {
    sounds.forEach(sound => {
      audioManagerRef.current.load(sound.id, sound.audioSrc);
    });
    
    // Clean up audio on unmount
    return () => {
      audioManagerRef.current.cleanup();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Handle audio play/pause based on state
  useEffect(() => {
    if (isPlaying) {
      activeSoundIds.forEach(id => {
        audioManagerRef.current.play(id);
        audioManagerRef.current.setVolume(id, volume);
      });
    } else {
      audioManagerRef.current.pauseAll();
    }
  }, [isPlaying, activeSoundIds]);
  
  // Handle volume change
  useEffect(() => {
    audioManagerRef.current.setVolumeAll(volume);
  }, [volume]);
  
  const breathingExercises: BreathingExercise[] = [
    {
      id: "4-7-8",
      name: "4-7-8 Breathing",
      description: "This technique helps reduce anxiety and helps people get to sleep.",
      steps: [
        { seconds: 4, instruction: "Inhale through your nose for 4 seconds" },
        { seconds: 7, instruction: "Hold your breath for 7 seconds" },
        { seconds: 8, instruction: "Exhale through your mouth for 8 seconds" },
      ],
      benefits: [
        "Reduces anxiety and stress",
        "Helps with falling asleep faster",
        "Improves focus and concentration",
        "Helps manage cravings",
      ],
    },
    {
      id: "box",
      name: "Box Breathing",
      description: "Used by Navy SEALs to calm down and focus in high-stress situations.",
      steps: [
        { seconds: 4, instruction: "Inhale through your nose for 4 seconds" },
        { seconds: 4, instruction: "Hold your breath for 4 seconds" },
        { seconds: 4, instruction: "Exhale through your mouth for 4 seconds" },
        { seconds: 4, instruction: "Hold your breath for 4 seconds" },
      ],
      benefits: [
        "Clears the mind",
        "Relieves stress",
        "Regulates the autonomic nervous system",
        "Improves mood and energy levels",
      ],
    },
    {
      id: "alternate-nostril",
      name: "Alternate Nostril Breathing",
      description: "A yogic breathing technique to balance the mind and reduce stress.",
      steps: [
        { seconds: 4, instruction: "Close right nostril, inhale through left nostril" },
        { seconds: 2, instruction: "Close both nostrils" },
        { seconds: 4, instruction: "Release right nostril, exhale" },
        { seconds: 4, instruction: "Inhale through right nostril" },
        { seconds: 2, instruction: "Close both nostrils" },
        { seconds: 4, instruction: "Release left nostril, exhale" },
      ],
      benefits: [
        "Balances the hemispheres of the brain",
        "Reduces stress and anxiety",
        "Promotes mental clarity",
        "Improves focus and attention",
      ],
    },
  ];
  
  const handleSoundToggle = (soundId: string) => {
    if (activeSoundIds.includes(soundId)) {
      setActiveSoundIds(activeSoundIds.filter(id => id !== soundId));
      audioManagerRef.current.pause(soundId);
    } else {
      // Limit to 3 active sounds
      if (activeSoundIds.length >= 3) {
        toast.warning("You can only mix up to 3 sounds at once");
        return;
      }
      
      const newActiveSoundIds = [...activeSoundIds, soundId];
      setActiveSoundIds(newActiveSoundIds);
      
      if (isPlaying) {
        audioManagerRef.current.play(soundId);
        audioManagerRef.current.setVolume(soundId, volume);
      }
    }
  };
  
  const handlePlayPause = () => {
    if (!isPlaying) {
      if (activeSoundIds.length === 0) {
        toast.warning("Please select at least one sound to play");
        return;
      }
      
      setIsPlaying(true);
      toast.success(`Playing ${activeSoundIds.map(id => sounds.find(s => s.id === id)?.name).join(", ")}`);
    } else {
      setIsPlaying(false);
      toast.info("Paused playback");
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const startBreathingExercise = (exercise: BreathingExercise) => {
    setActiveExercise(exercise);
    setCurrentStep(0);
    setBreathingSeconds(exercise.steps[0].seconds);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          // Move to next step or loop back to beginning
          const nextStep = (currentStep + 1) % exercise.steps.length;
          setCurrentStep(nextStep);
          return exercise.steps[nextStep].seconds;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const stopBreathingExercise = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setActiveExercise(null);
    setCurrentStep(0);
    setBreathingSeconds(0);
  };
  
  // Handle timer set for sound playback
  const handleSetTimer = (minutes: number) => {
    toast.success(`Timer set for ${minutes} minutes`);
    
    setTimeout(() => {
      setIsPlaying(false);
      audioManagerRef.current.pauseAll();
      toast.info("Timer completed - sound playback stopped");
    }, minutes * 60 * 1000);
  };
  
  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Relaxation Studio</h1>
          <p className="text-muted-foreground">
            Unwind with soothing sounds and guided breathing exercises
          </p>
        </div>
        
        <Tabs defaultValue="sounds" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="sounds" className="flex items-center gap-1">
              <Music className="h-4 w-4" />
              <span>Sounds & Music</span>
            </TabsTrigger>
            <TabsTrigger value="breathing" className="flex items-center gap-1">
              <Wind className="h-4 w-4" />
              <span>Breathing Exercises</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sounds">
            {activeExercise && (
              <Card className="mb-8 bg-primary/5 border-primary/10 animate-fade-in">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      You're currently doing a breathing exercise. Would you like to stop it to use the sound player?
                    </p>
                    <Button onClick={stopBreathingExercise}>
                      Stop Exercise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid gap-8 md:grid-cols-3 md:gap-6">
              <div className="space-y-6 md:col-span-2">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Choose Your Sounds</CardTitle>
                    <CardDescription>
                      Select up to 3 sounds to create your perfect ambiance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="nature">
                      <TabsList className="mb-4">
                        <TabsTrigger value="nature">Nature</TabsTrigger>
                        <TabsTrigger value="ambient">Ambient</TabsTrigger>
                        <TabsTrigger value="white">White Noise</TabsTrigger>
                        <TabsTrigger value="sleep">Sleep</TabsTrigger>
                      </TabsList>
                      
                      {["nature", "ambient", "white", "sleep"].map((category) => (
                        <TabsContent key={category} value={category} className="mt-0">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {sounds
                              .filter((sound) => sound.category === category)
                              .map((sound) => (
                                <Button
                                  key={sound.id}
                                  variant={activeSoundIds.includes(sound.id) ? "default" : "outline"}
                                  className="h-auto py-3 flex flex-col items-center gap-2"
                                  onClick={() => handleSoundToggle(sound.id)}
                                >
                                  {sound.icon}
                                  <span>{sound.name}</span>
                                </Button>
                              ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle>Sound Combinations</CardTitle>
                      <CardDescription>
                        Popular mixes to help you relax and focus
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: "Rainy Day", sounds: ["rain", "cafe"] },
                          { name: "Ocean Breeze", sounds: ["waves", "wind"] },
                          { name: "Cozy Evening", sounds: ["fire", "rain"] },
                          { name: "Forest Retreat", sounds: ["forest", "rain"] },
                        ].map((combo) => (
                          <Button
                            key={combo.name}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              if (combo.sounds.length <= 3) {
                                setActiveSoundIds(combo.sounds);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Music className="h-4 w-4" />
                              <span>{combo.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle>Timer</CardTitle>
                      <CardDescription>
                        Set a timer for your relaxation session
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm">Play Duration</span>
                          <div className="grid grid-cols-3 gap-2">
                            {[15, 30, 60].map((minutes) => (
                              <Button key={minutes} variant="outline">
                                {minutes} min
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Timer className="h-4 w-4" />
                            <span>Custom Timer</span>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Moon className="h-4 w-4" />
                            <span>Sleep Mode</span>
                          </Button>
                        </div>
                        
                        <div className="pt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Timer functionality is simulated in this demo</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <Card className="border-none shadow-sm sticky top-24">
                  <CardHeader>
                    <CardTitle>Now Playing</CardTitle>
                    <CardDescription>
                      {activeSoundIds.length === 0
                        ? "Select sounds to begin"
                        : `${activeSoundIds.length} sound${activeSoundIds.length > 1 ? "s" : ""} selected`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                        {activeSoundIds.length === 0 ? (
                          <Music className="h-16 w-16 text-muted-foreground/50" />
                        ) : (
                          <div className={`relative ${isPlaying ? "animate-float" : ""}`}>
                            <div className="grid grid-cols-2 gap-4">
                              {activeSoundIds.slice(0, 4).map((id) => {
                                const sound = sounds.find((s) => s.id === id);
                                return (
                                  <div
                                    key={id}
                                    className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
                                  >
                                    <div className="text-primary">{sound?.icon}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="text-center mb-4">
                          <h3 className="font-medium">
                            {activeSoundIds.length === 0
                              ? "No sounds selected"
                              : activeSoundIds
                                  .map((id) => sounds.find((s) => s.id === id)?.name)
                                  .join(" + ")}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            disabled={activeSoundIds.length === 0}
                            onClick={handlePlayPause}
                          >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </Button>
                          <div className="flex-1 flex items-center gap-2">
                            <Volume2 className="h-4 w-4 text-muted-foreground" />
                            <Slider
                              value={[volume]}
                              max={100}
                              step={1}
                              onValueChange={handleVolumeChange}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {activeSoundIds.map((id) => {
                            const sound = sounds.find((s) => s.id === id);
                            return (
                              <div
                                key={id}
                                className="flex items-center gap-1.5 text-sm bg-muted rounded-full px-3 py-1"
                              >
                                <div className="text-primary">{sound?.icon}</div>
                                <span>{sound?.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 ml-1"
                                  onClick={() => handleSoundToggle(id)}
                                >
                                  <Close className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card className="border-none shadow-sm bg-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Benefits of Sound Therapy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                          <span>Reduces stress and anxiety</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                          <span>Improves focus and concentration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                          <span>Promotes better sleep quality</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                          <span>Creates a calming environment</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="breathing">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-1 space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Breathing Exercises</CardTitle>
                    <CardDescription>
                      Choose an exercise to reduce stress and increase mindfulness
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {breathingExercises.map((exercise) => (
                        <Button
                          key={exercise.id}
                          variant={activeExercise?.id === exercise.id ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => startBreathingExercise(exercise)}
                        >
                          <Wind className="mr-2 h-4 w-4" />
                          {exercise.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-sm bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Benefits of Mindful Breathing</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span>Activates the parasympathetic nervous system</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span>Lowers heart rate and blood pressure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span>Reduces stress hormones like cortisol</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span>Improves focus and emotional regulation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span>Helps with anxiety and panic symptoms</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                {activeExercise ? (
                  <Card className="border-none shadow-sm h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{activeExercise.name}</CardTitle>
                          <CardDescription>{activeExercise.description}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={stopBreathingExercise}>
                          Stop
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="relative mb-8">
                        <div
                          className={`w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center ${
                            breathingSeconds > 0 ? "animate-breathe" : ""
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-5xl font-bold text-primary">
                              {breathingSeconds}
                            </div>
                            <div className="text-muted-foreground">seconds</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center max-w-md">
                        <p className="text-xl font-medium mb-2">
                          {activeExercise.steps[currentStep].instruction}
                        </p>
                        <p className="text-muted-foreground">
                          Step {currentStep + 1} of {activeExercise.steps.length}
                        </p>
                      </div>
                      
                      <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md">
                        {activeExercise.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <div className="text-center max-w-md">
                      <div className="rounded-full bg-muted p-6 mb-4 inline-block">
                        <Wind className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Select a Breathing Exercise</h3>
                      <p className="text-muted-foreground mb-6">
                        Choose one of the breathing techniques to get started with guided practice.
                      </p>
                      <Button onClick={() => startBreathingExercise(breathingExercises[0])}>
                        Start 4-7-8 Breathing
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function Close(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
