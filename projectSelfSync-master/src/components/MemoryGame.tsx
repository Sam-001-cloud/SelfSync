
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Moon, Bell, Award, BookText } from 'lucide-react';
import { toast } from "sonner";

type CardType = {
  id: number;
  iconType: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const icons = {
  heart: <Heart className="h-10 w-10 text-primary" />,
  star: <Star className="h-10 w-10 text-secondary" />,
  moon: <Moon className="h-10 w-10 text-accent" />,
  bell: <Bell className="h-10 w-10 text-primary" />,
  award: <Award className="h-10 w-10 text-secondary" />,
  book: <BookText className="h-10 w-10 text-accent" />
};

export function MemoryGame() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Initialize or reset the game
  const initGame = () => {
    const iconTypes = ['heart', 'star', 'moon', 'bell', 'award', 'book'];
    const duplicatedIcons = [...iconTypes, ...iconTypes];
    
    // Shuffle the cards
    const shuffled = duplicatedIcons
      .sort(() => Math.random() - 0.5)
      .map((iconType, index) => ({
        id: index,
        iconType,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(true);
  };

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      
      if (cards[firstIndex].iconType === cards[secondIndex].iconType) {
        // Match found
        setCards(prevCards => 
          prevCards.map((card, index) => 
            index === firstIndex || index === secondIndex
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
        toast.success("Match found!");
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map((card, index) => 
              index === firstIndex || index === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 800);
      }
      
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    if (gameStarted && matchedPairs === 6) {
      toast.success(`Congratulations! You completed the game in ${moves} moves!`);
    }
  }, [matchedPairs, moves, gameStarted]);

  // Handle card click
  const handleCardClick = (index: number) => {
    // Prevent clicking if already two cards are flipped or this card is already flipped/matched
    if (
      flippedCards.length === 2 || 
      cards[index].isFlipped || 
      cards[index].isMatched
    ) {
      return;
    }

    // Flip the card
    setCards(prevCards => 
      prevCards.map((card, i) => 
        i === index
          ? { ...card, isFlipped: true }
          : card
      )
    );

    // Add to flipped cards
    setFlippedCards(prev => [...prev, index]);
  };

  return (
    <Card className="w-full bg-background shadow-md">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Wellness Memory Game</h3>
          <p className="text-muted-foreground text-sm">Match the wellness symbols to earn points</p>
          
          {gameStarted && (
            <div className="flex justify-between items-center mt-2">
              <div>Moves: <span className="font-bold">{moves}</span></div>
              <div>Pairs: <span className="font-bold">{matchedPairs}/6</span></div>
            </div>
          )}
        </div>
        
        {!gameStarted ? (
          <Button 
            className="w-full" 
            onClick={initGame}
          >
            Start Game
          </Button>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {cards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`aspect-square flex items-center justify-center rounded-md transition-all duration-300 cursor-pointer 
                    ${card.isFlipped || card.isMatched ? 'bg-primary/10' : 'bg-muted'} 
                    ${card.isMatched ? 'border-2 border-primary' : ''}
                    hover:opacity-90`}
                >
                  {(card.isFlipped || card.isMatched) ? (
                    <div className="animate-scale-in">
                      {icons[card.iconType as keyof typeof icons]}
                    </div>
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20">
                      <span className="text-primary font-bold">?</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {matchedPairs === 6 && (
              <Button 
                className="w-full" 
                onClick={initGame}
              >
                Play Again
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
