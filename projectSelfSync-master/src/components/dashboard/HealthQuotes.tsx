
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

type HealthQuote = {
  id: number;
  quote: string;
  author: string;
};

const healthQuotes: HealthQuote[] = [
  {
    id: 1,
    quote: "The greatest wealth is health.",
    author: "Virgil",
  },
  {
    id: 2,
    quote: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    id: 3,
    quote: "Health is not valued until sickness comes.",
    author: "Thomas Fuller",
  },
  {
    id: 4,
    quote: "Physical fitness is not only one of the most important keys to a healthy body, it is the basis of dynamic and creative intellectual activity.",
    author: "John F. Kennedy",
  },
  {
    id: 5,
    quote: "Happiness is nothing more than good health and a bad memory.",
    author: "Albert Schweitzer",
  },
];

export const HealthQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev === healthQuotes.length - 1 ? 0 : prev + 1));
  };

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev === 0 ? healthQuotes.length - 1 : prev - 1));
  };

  const quote = healthQuotes[currentQuote];

  return (
    <Card className="border-none shadow-sm mb-6">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <blockquote className="text-sm md:text-base font-medium italic">
              "{quote.quote}"
            </blockquote>
            <cite className="block text-xs md:text-sm font-medium not-italic text-muted-foreground">
              — {quote.author}
            </cite>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-7 w-7 rounded-full border-0" 
              onClick={prevQuote}
            >
              <ChevronLeft className="h-3 w-3" />
              <span className="sr-only">Previous quote</span>
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-7 w-7 rounded-full border-0" 
              onClick={nextQuote}
            >
              <ChevronRight className="h-3 w-3" />
              <span className="sr-only">Next quote</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
