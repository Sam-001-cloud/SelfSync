
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface BreathingExerciseProps {
  duration: number;
  steps: {
    name: string;
    duration: number;
  }[];
  onComplete: () => void;
}

export function BreathingExercise({ duration, steps, onComplete }: BreathingExerciseProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [stepTimeLeft, setStepTimeLeft] = useState(steps[0].duration);
  
  const currentStep = steps[currentStepIndex];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1;
        const progressPercentage = 100 - ((newTimeLeft / duration) * 100);
        setProgress(progressPercentage);
        
        return newTimeLeft;
      });
      
      setStepTimeLeft((prev) => {
        const newStepTimeLeft = prev - 1;
        
        if (newStepTimeLeft <= 0 && currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prevStep) => prevStep + 1);
          return steps[currentStepIndex + 1].duration;
        } else if (newStepTimeLeft <= 0) {
          clearInterval(interval);
          onComplete();
        }
        
        return newStepTimeLeft;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentStepIndex, duration, onComplete, steps]);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-card shadow-sm">
      <h3 className="text-3xl font-bold mb-6">{currentStep.name}</h3>
      
      <div className="w-full max-w-md mb-8">
        <Progress value={progress} className="h-3" />
      </div>
      
      <div className="text-4xl font-mono font-bold mb-8">
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      
      <div className="text-muted-foreground">
        Next: {currentStepIndex < steps.length - 1 
          ? steps[currentStepIndex + 1].name 
          : 'Complete'}
      </div>
    </div>
  );
}
