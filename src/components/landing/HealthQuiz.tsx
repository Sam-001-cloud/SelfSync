
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define quiz questions
const quizQuestions = [
  {
    id: "sleep",
    question: "How many hours do you sleep per night on average?",
    options: [
      { value: "less-than-6", label: "Less than 6 hours" },
      { value: "6-to-8", label: "6-8 hours" },
      { value: "more-than-8", label: "More than 8 hours" }
    ]
  },
  {
    id: "water",
    question: "How much water do you drink daily?",
    options: [
      { value: "less-than-1", label: "Less than 1 liter" },
      { value: "1-to-2", label: "1-2 liters" },
      { value: "more-than-2", label: "More than 2 liters" }
    ]
  },
  {
    id: "exercise",
    question: "How often do you exercise?",
    options: [
      { value: "rarely", label: "Rarely or never" },
      { value: "1-to-3", label: "1-3 times a week" },
      { value: "4-plus", label: "4+ times a week" }
    ]
  }
];

// Define form schema
const formSchema = z.object({
  sleep: z.string(),
  water: z.string(),
  exercise: z.string()
});

type FormValues = z.infer<typeof formSchema>;

export function HealthQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sleep: "",
      water: "",
      exercise: ""
    }
  });

  const onSubmit = (values: FormValues) => {
    // Calculate score based on answers
    let healthScore = 0;
    
    // Sleep score
    if (values.sleep === "less-than-6") healthScore += 1;
    else if (values.sleep === "6-to-8") healthScore += 3;
    else if (values.sleep === "more-than-8") healthScore += 2;
    
    // Water score
    if (values.water === "less-than-1") healthScore += 1;
    else if (values.water === "1-to-2") healthScore += 2;
    else if (values.water === "more-than-2") healthScore += 3;
    
    // Exercise score
    if (values.exercise === "rarely") healthScore += 1;
    else if (values.exercise === "1-to-3") healthScore += 2;
    else if (values.exercise === "4-plus") healthScore += 3;
    
    setScore(healthScore);
    setShowResults(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const restartQuiz = () => {
    form.reset();
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
  };

  // Get feedback based on score
  const getFeedback = () => {
    const maxScore = 9;
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 80) {
      return {
        title: "Excellent Health Habits!",
        message: "You're doing great! Keep up the good work with your wellness journey."
      };
    } else if (percentage >= 60) {
      return {
        title: "Good Health Habits",
        message: "You have some good habits. With a few adjustments, you can improve your wellness journey."
      };
    } else {
      return {
        title: "Health Habits Need Attention",
        message: "Your wellness journey is just beginning. SelfSync can help you build better habits!"
      };
    }
  };

  const feedback = getFeedback();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Wellness Assessment</CardTitle>
        <CardDescription>
          Take this quick quiz to assess your current wellness habits
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          {!showResults ? (
            <div>
              <h3 className="text-lg font-medium mb-3">
                {quizQuestions[currentQuestion].question}
              </h3>
              
              <FormField
                control={form.control}
                name={quizQuestions[currentQuestion].id as keyof FormValues}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        {quizQuestions[currentQuestion].options.map((option) => (
                          <FormItem
                            key={option.value}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-bold">{feedback.title}</h3>
              <p className="text-muted-foreground">{feedback.message}</p>
              <div className="flex justify-center mt-4">
                <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-4xl font-bold">{Math.round((score / 9) * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!showResults ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNextQuestion}>
              {currentQuestion < quizQuestions.length - 1 ? "Next" : "See Results"}
            </Button>
          </>
        ) : (
          <Button onClick={restartQuiz} className="w-full">
            Take Quiz Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
