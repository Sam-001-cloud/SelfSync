import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { AlertTriangle, Music, Pause, Play, Timer, Moon, Volume2 } from "lucide-react";
import { Sound } from "./types";
import { soundCombinations } from "./relaxationData";
import { AudioManager } from "./AudioManager";
import { Close } from "../ui/icons";

interface SoundPlayerProps {
  sounds: Sound[];
  audioManager: AudioManager;
  activeExercise: boolean;
  stopExercise: () => void;
}

export function SoundPlayer({ sounds, audioManager, activeExercise, stopExercise }: SoundPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [activeSoundIds, setActiveSoundIds] = useState<string[]>([]);
  const [loadingSounds, setLoadingSounds] = useState<string[]>([]);

  useEffect(() => {
    const loadSounds = async () => {
      const loadingPromises = [];
      setLoadingSounds(sounds.map(s => s.id));
      
      for (const sound of sounds) {
        try {
          const loadPromise = audioManager.load(sound.id, sound.audioSrc);
          loadingPromises.push(loadPromise.then(() => {
            setLoadingSounds(prev => prev.filter(id => id !== sound.id));
          }).catch(error => {
            console.error(`Failed to load sound ${sound.id}:`, error);
            toast.error(`Could not load "${sound.name}" sound file`);
            setLoadingSounds(prev => prev.filter(id => id !== sound.id));
          }));
        } catch (error) {
          console.error(`Error setting up sound ${sound.id}:`, error);
          setLoadingSounds(prev => prev.filter(id => id !== sound.id));
        }
      }
      
      await Promise.allSettled(loadingPromises);
    };
    
    loadSounds();
    
    return () => {
      audioManager.pauseAll();
    };
  }, [sounds, audioManager]);

  useEffect(() => {
    const playActiveSounds = async () => {
      if (isPlaying) {
        const currentlyLoading = [...activeSoundIds];
        setLoadingSounds(currentlyLoading);
        
        for (const id of activeSoundIds) {
          try {
            await audioManager.play(id);
            audioManager.setVolume(id, volume);
            setLoadingSounds(prev => prev.filter(soundId => soundId !== id));
          } catch (err) {
            console.error(`Failed to play ${id}:`, err);
            setLoadingSounds(prev => prev.filter(soundId => soundId !== id));
            toast.error(`Failed to play ${sounds.find(s => s.id === id)?.name}. Please try again.`);
          }
        }
      } else {
        audioManager.pauseAll();
        setLoadingSounds([]);
      }
    };
    
    playActiveSounds();
  }, [isPlaying, activeSoundIds, audioManager, volume, sounds]);

  useEffect(() => {
    audioManager.setVolumeAll(volume);
  }, [volume, audioManager]);

  const handleSoundToggle = (soundId: string) => {
    if (activeSoundIds.includes(soundId)) {
      setActiveSoundIds(activeSoundIds.filter(id => id !== soundId));
      audioManager.pause(soundId);
    } else {
      if (activeSoundIds.length >= 3) {
        toast.warning("You can only mix up to 3 sounds at once");
        return;
      }
      
      const newActiveSoundIds = [...activeSoundIds, soundId];
      setActiveSoundIds(newActiveSoundIds);
      
      if (isPlaying) {
        const playSound = async () => {
          setLoadingSounds(prev => [...prev, soundId]);
          try {
            await audioManager.play(soundId);
            audioManager.setVolume(soundId, volume);
          } catch (error) {
            console.error(`Failed to play ${soundId}:`, error);
            toast.error(`Failed to play ${sounds.find(s => s.id === soundId)?.name}. Please try again.`);
          } finally {
            setLoadingSounds(prev => prev.filter(id => id !== soundId));
          }
        };
        
        playSound();
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

  const handleSetTimer = (minutes: number) => {
    toast.success(`Timer set for ${minutes} minutes`);
    
    setTimeout(() => {
      setIsPlaying(false);
      audioManager.pauseAll();
      toast.info("Timer completed - sound playback stopped");
    }, minutes * 60 * 1000);
  };

  return (
    <div className="grid gap-8 md:grid-cols-3 md:gap-6">
      <div className="space-y-6 md:col-span-2">
        {activeExercise && (
          <Card className="mb-8 bg-primary/5 border-primary/10 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  You're currently doing a breathing exercise. Would you like to stop it to use the sound player?
                </p>
                <Button onClick={stopExercise}>
                  Stop Exercise
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                          disabled={loadingSounds.includes(sound.id)}
                        >
                          {loadingSounds.includes(sound.id) ? (
                            <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                          ) : (
                            sound.icon
                          )}
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
                {soundCombinations.map((combo) => (
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
                      <Button 
                        key={minutes} 
                        variant="outline"
                        onClick={() => handleSetTimer(minutes)}
                      >
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
                            <div className="text-primary">
                              {loadingSounds.includes(id) ? (
                                <div className="h-6 w-6 rounded-full border-2 border-current border-t-transparent animate-spin" />
                              ) : (
                                sound?.icon
                              )}
                            </div>
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
                    disabled={activeSoundIds.length === 0 || loadingSounds.length > 0}
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
                        <div className="text-primary">
                          {loadingSounds.includes(id) ? (
                            <div className="h-3 w-3 rounded-full border-1.5 border-current border-t-transparent animate-spin" />
                          ) : (
                            sound?.icon
                          )}
                        </div>
                        <span>{sound?.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => handleSoundToggle(id)}
                          disabled={loadingSounds.includes(id)}
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
