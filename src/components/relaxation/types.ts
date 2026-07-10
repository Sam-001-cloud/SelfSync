
import { ReactNode } from "react";

export interface Sound {
  id: string;
  name: string;
  icon: ReactNode;
  category: "nature" | "ambient" | "white" | "sleep";
  audioSrc: string;
}

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  steps: { seconds: number; instruction: string }[];
  benefits: string[];
}
