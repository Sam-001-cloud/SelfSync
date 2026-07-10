import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Layout from "@/components/Layout";
import { ArrowRight, CheckCircle, Info, AlertTriangle, AlertCircle } from "lucide-react";

type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese' | null;

export default function BMICalculator() {
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [height, setHeight] = useState<number | string>('');
  const [heightFt, setHeightFt] = useState<number | string>('');
  const [heightIn, setHeightIn] = useState<number | string>('');
  const [weight, setWeight] = useState<number | string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<BMICategory>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const calculateBMI = () => {
    let heightInMeters: number;
    let weightInKg: number;
    
    if (heightUnit === 'cm') {
      heightInMeters = Number(height) / 100;
    } else {
      const totalInches = (Number(heightFt) * 12) + Number(heightIn);
      heightInMeters = totalInches * 0.0254;
    }
    
    if (weightUnit === 'kg') {
      weightInKg = Number(weight);
    } else {
      weightInKg = Number(weight) * 0.453592;
    }
    
    const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
    
    if (!isNaN(calculatedBMI) && isFinite(calculatedBMI)) {
      setBmi(parseFloat(calculatedBMI.toFixed(1)));
      
      if (calculatedBMI < 18.5) {
        setBmiCategory('underweight');
      } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
        setBmiCategory('normal');
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        setBmiCategory('overweight');
      } else {
        setBmiCategory('obese');
      }
    }
  };
  
  useEffect(() => {
    if (bmiCategory === 'underweight') {
      setRecommendations([
        "Focus on nutrient-dense foods to gain weight healthily",
        "Consider consulting with a dietitian for a personalized meal plan",
        "Incorporate strength training to build muscle mass",
        "Eat more frequently with protein-rich snacks between meals",
        "Track your calorie intake to ensure you're eating enough"
      ]);
    } else if (bmiCategory === 'normal') {
      setRecommendations([
        "Maintain your current balanced diet and exercise routine",
        "Stay hydrated with at least 8 glasses of water daily",
        "Focus on quality sleep (7-9 hours per night)",
        "Continue regular physical activity for overall health",
        "Practice stress management techniques such as meditation"
      ]);
    } else if (bmiCategory === 'overweight') {
      setRecommendations([
        "Increase physical activity with both cardio and strength training",
        "Focus on portion control and mindful eating",
        "Reduce intake of processed foods and added sugars",
        "Incorporate more vegetables and lean proteins in your diet",
        "Consider keeping a food journal to track eating patterns"
      ]);
    } else if (bmiCategory === 'obese') {
      setRecommendations([
        "Consult with healthcare professionals for personalized advice",
        "Start with small, sustainable changes to diet and activity levels",
        "Focus on nutrient-dense foods and appropriate portion sizes",
        "Engage in regular, gentle physical activity as appropriate",
        "Consider joining a support group for motivation and accountability"
      ]);
    }
  }, [bmiCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateBMI();
  };
  
  const getBMIColor = () => {
    if (bmiCategory === 'normal') return 'text-green-500';
    if (bmiCategory === 'underweight') return 'text-amber-500';
    if (bmiCategory === 'overweight') return 'text-orange-500';
    if (bmiCategory === 'obese') return 'text-red-500';
    return '';
  };
  
  const getBMIIcon = () => {
    if (bmiCategory === 'normal') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (bmiCategory === 'underweight') return <Info className="h-5 w-5 text-amber-500" />;
    if (bmiCategory === 'overweight') return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    if (bmiCategory === 'obese') return <AlertCircle className="h-5 w-5 text-red-500" />;
    return null;
  };
  
  const getBMIAlert = () => {
    if (!bmiCategory) return null;
    
    let variant: 'default' | 'destructive' = 'default';
    let icon = getBMIIcon();
    let title = '';
    let description = '';
    
    if (bmiCategory === 'normal') {
      title = "Healthy Weight Range";
      description = "Your BMI indicates you're in a healthy weight range. Keep up the good work with balanced nutrition and regular activity.";
    } else if (bmiCategory === 'underweight') {
      title = "Underweight";
      description = "Your BMI suggests you may be underweight. Focus on nutrient-rich foods and consider consulting a healthcare professional.";
    } else if (bmiCategory === 'overweight') {
      title = "Overweight";
      description = "Your BMI indicates you're in the overweight range. Small changes to diet and activity levels can help improve your health.";
    } else if (bmiCategory === 'obese') {
      variant = 'destructive';
      title = "Obesity Range";
      description = "Your BMI falls in the obesity range. It's recommended to consult with a healthcare provider for personalized guidance.";
    }
    
    return (
      <Alert variant={variant} className="mt-4">
        <div className="flex items-center gap-2">
          {icon}
          <AlertTitle>{title}</AlertTitle>
        </div>
        <AlertDescription className="mt-2">{description}</AlertDescription>
      </Alert>
    );
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">BMI Calculator</h1>
          <p className="text-muted-foreground">
            Calculate your Body Mass Index and get personalized health recommendations
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Calculate Your BMI</CardTitle>
                <CardDescription>
                  Enter your height and weight to calculate your Body Mass Index
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Height</Label>
                      <RadioGroup
                        value={heightUnit}
                        onValueChange={(val) => setHeightUnit(val as 'cm' | 'ft')}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cm" id="cm" />
                          <Label htmlFor="cm">Centimeters</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ft" id="ft" />
                          <Label htmlFor="ft">Feet & Inches</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {heightUnit === 'cm' ? (
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="e.g., 175"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          required
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="feet">Feet</Label>
                          <Input
                            id="feet"
                            type="number"
                            placeholder="e.g., 5"
                            value={heightFt}
                            onChange={(e) => setHeightFt(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="inches">Inches</Label>
                          <Input
                            id="inches"
                            type="number"
                            placeholder="e.g., 10"
                            value={heightIn}
                            onChange={(e) => setHeightIn(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Weight</Label>
                      <RadioGroup
                        value={weightUnit}
                        onValueChange={(val) => setWeightUnit(val as 'kg' | 'lb')}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="kg" id="kg" />
                          <Label htmlFor="kg">Kilograms</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="lb" id="lb" />
                          <Label htmlFor="lb">Pounds</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor="weight">Weight ({weightUnit})</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder={`e.g., ${weightUnit === 'kg' ? '70' : '154'}`}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Calculate BMI
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="mt-8">
              <Card className="border-none shadow-sm bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Understanding BMI</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-4">
                    Body Mass Index (BMI) is a simple calculation using height and weight that is commonly used to classify weight status. It's an indicator of body fatness and potential health risks.
                  </p>
                  
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
                      <span>Below 18.5 - Underweight</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                      <span>18.5 to 24.9 - Normal weight</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                      <span>25.0 to 29.9 - Overweight</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                      <span>30.0 and above - Obesity</span>
                    </li>
                  </ul>
                  
                  <p className="mt-4">
                    Note: BMI is a screening tool, not a diagnostic tool. Factors like muscle mass, body composition, age, and ethnicity can influence the interpretation of BMI.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-8">
            {bmi !== null && (
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Your Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold mb-2 transition-all animate-scale-in">
                      <span className={getBMIColor()}>{bmi}</span>
                    </div>
                    <p className="text-muted-foreground">Your BMI</p>
                  </div>
                  
                  {getBMIAlert()}
                  
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Personalized Recommendations</h3>
                    <ul className="space-y-2">
                      {recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                          <span className="text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {bmi === null && (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="rounded-full bg-muted/50 p-6 mb-4">
                  <Info className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Calculate Your BMI</h3>
                <p className="text-muted-foreground max-w-md">
                  Fill out the form to see your Body Mass Index and get personalized health recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
