
import { Card } from "@/components/ui/card";

const moodImages = {
  happy: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  calm: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  anxious: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  sad: "https://images.unsplash.com/photo-1541199249251-f713e6145474?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  energetic: "https://images.unsplash.com/photo-1517130038641-a774d04afb3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  tired: "https://images.unsplash.com/photo-1546379782-8e63e7ef382a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

export function MoodTracking() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-0 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all border-none group">
          <div className="h-32 relative overflow-hidden">
            <img 
              src={moodImages.happy} 
              alt="Happy" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="p-3 bg-black/30 text-white">
            <div className="text-3xl mb-1 text-center">😊</div>
            <div className="text-sm font-medium text-center">Happy</div>
          </div>
        </Card>
        
        <Card className="p-0 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all border-none group">
          <div className="h-32 relative overflow-hidden">
            <img 
              src={moodImages.calm} 
              alt="Calm" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="p-3 bg-black/30 text-white">
            <div className="text-3xl mb-1 text-center">😌</div>
            <div className="text-sm font-medium text-center">Calm</div>
          </div>
        </Card>
        
        <Card className="p-0 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all border-none group">
          <div className="h-32 relative overflow-hidden">
            <img 
              src={moodImages.anxious} 
              alt="Anxious" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="p-3 bg-black/30 text-white">
            <div className="text-3xl mb-1 text-center">😨</div>
            <div className="text-sm font-medium text-center">Anxious</div>
          </div>
        </Card>
        
        <Card className="p-0 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all border-none group">
          <div className="h-32 relative overflow-hidden">
            <img 
              src={moodImages.sad} 
              alt="Sad" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="p-3 bg-black/30 text-white">
            <div className="text-3xl mb-1 text-center">😔</div>
            <div className="text-sm font-medium text-center">Sad</div>
          </div>
        </Card>
        
        <Card className="p-0 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all border-none group">
          <div className="h-32 relative overflow-hidden">
            <img 
              src={moodImages.energetic} 
              alt="Energetic" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="p-3 bg-black/30 text-white">
            <div className="text-3xl mb-1 text-center">⚡</div>
            <div className="text-sm font-medium text-center">Energetic</div>
          </div>
        </Card>
        
        <Card className="p-0 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all border-none group">
          <div className="h-32 relative overflow-hidden">
            <img 
              src={moodImages.tired} 
              alt="Tired" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="p-3 bg-black/30 text-white">
            <div className="text-3xl mb-1 text-center">😴</div>
            <div className="text-sm font-medium text-center">Tired</div>
          </div>
        </Card>
      </div>
    </section>
  );
}
