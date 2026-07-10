
export class AudioManager {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private loadingPromises: Map<string, Promise<void>> = new Map();
  
  // Load an audio element
  load(id: string, src: string): Promise<void> {
    if (!this.audioElements.has(id)) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audio.crossOrigin = "anonymous"; // Add cross-origin support
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        audio.addEventListener("canplaythrough", () => resolve(), { once: true });
        audio.addEventListener("error", (e) => {
          console.error(`Error loading audio ${id}:`, e);
          reject(new Error(`Failed to load audio: ${e}`));
        }, { once: true });
        
        // Set the source after adding event listeners
        audio.src = src;
        // Start loading the audio
        audio.load();
      });
      
      this.audioElements.set(id, audio);
      this.loadingPromises.set(id, loadPromise);
      return loadPromise;
    }
    
    return this.loadingPromises.get(id) || Promise.resolve();
  }
  
  // Play audio
  async play(id: string): Promise<void> {
    const audio = this.audioElements.get(id);
    if (audio) {
      try {
        // Ensure audio is loaded before playing
        if (this.loadingPromises.has(id)) {
          await this.loadingPromises.get(id);
        }
        
        // Some browsers require user interaction before playing audio
        // Using catch to handle this gracefully
        await audio.play();
      } catch (err) {
        console.error("Failed to play audio:", err);
        throw err;
      }
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
      audio.volume = Math.max(0, Math.min(1, volume / 100));
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
    const normalizedVolume = Math.max(0, Math.min(1, volume / 100));
    this.audioElements.forEach(audio => {
      audio.volume = normalizedVolume;
    });
  }
  
  // Check if audio is loaded
  isLoaded(id: string): boolean {
    const audio = this.audioElements.get(id);
    return audio ? audio.readyState >= 3 : false;
  }
  
  // Check if audio is playing
  isPlaying(id: string): boolean {
    const audio = this.audioElements.get(id);
    return audio ? !audio.paused : false;
  }
  
  // Clean up
  cleanup(): void {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.src = "";
    });
    this.audioElements.clear();
    this.loadingPromises.clear();
  }
  
  // Replace audio source
  replaceSource(id: string, newSrc: string): Promise<void> {
    const audio = this.audioElements.get(id);
    if (audio) {
      this.loadingPromises.delete(id);
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        audio.addEventListener("canplaythrough", () => resolve(), { once: true });
        audio.addEventListener("error", (e) => reject(new Error(`Failed to load audio: ${e}`)), { once: true });
        
        // Update the source
        audio.pause();
        audio.src = newSrc;
        audio.load();
      });
      
      this.loadingPromises.set(id, loadPromise);
      return loadPromise;
    }
    
    return this.load(id, newSrc);
  }
}
