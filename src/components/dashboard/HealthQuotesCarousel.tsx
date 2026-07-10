
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

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

export const HealthQuotesCarousel = () => {
  return (
    <Carousel className="mb-6">
      <CarouselContent>
        {healthQuotes.map((quote) => (
          <CarouselItem key={quote.id}>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="max-w-md">
                    <blockquote className="text-sm md:text-base font-medium italic mb-1">
                      "{quote.quote}"
                    </blockquote>
                    <cite className="block text-xs md:text-sm font-medium not-italic text-muted-foreground">
                      — {quote.author}
                    </cite>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2" />
      <CarouselNext className="right-2 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
};
