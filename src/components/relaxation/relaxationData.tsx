
import {
  Cloud,
  Coffee,
  Flame,
  Leaf,
  Moon,
  Music,
  VolumeX,
  Waves,
  Wind,
} from "lucide-react";
import { BreathingExercise, Sound } from "./types";

export const sounds: Sound[] = [
  { id: "rain", name: "Rain", icon: <Cloud />, category: "nature", audioSrc: "https://assets.codepen.io/858/rain.mp3" },
  { id: "thunder", name: "Thunder Storm", icon: <Cloud />, category: "nature", audioSrc: "https://assets.codepen.io/858/storm.mp3" },
  { id: "forest", name: "Forest", icon: <Leaf />, category: "nature", audioSrc: "https://assets.codepen.io/858/forest.mp3" },
  { id: "waves", name: "Ocean Waves", icon: <Waves />, category: "nature", audioSrc: "https://assets.codepen.io/858/waves.mp3" },
  { id: "wind", name: "Wind", icon: <Wind />, category: "nature", audioSrc: "https://assets.codepen.io/858/wind.mp3" },
  { id: "fire", name: "Fireplace", icon: <Flame />, category: "ambient", audioSrc: "https://assets.codepen.io/858/fire.mp3" },
  { id: "cafe", name: "Cafe", icon: <Coffee />, category: "ambient", audioSrc: "https://assets.codepen.io/858/cafe.mp3" },
  { id: "white", name: "White Noise", icon: <VolumeX />, category: "white", audioSrc: "https://assets.codepen.io/858/white_noise.mp3" },
  { id: "pink", name: "Pink Noise", icon: <VolumeX />, category: "white", audioSrc: "https://assets.codepen.io/858/pink_noise.mp3" },
  { id: "brown", name: "Brown Noise", icon: <VolumeX />, category: "white", audioSrc: "https://assets.codepen.io/858/brown_noise.mp3" },
  { id: "sleep", name: "Sleep Music", icon: <Moon />, category: "sleep", audioSrc: "https://assets.codepen.io/858/sleep.mp3" },
  { id: "lullaby", name: "Lullaby", icon: <Music />, category: "sleep", audioSrc: "https://assets.codepen.io/858/lullaby.mp3" },
];

export const soundCombinations = [
  { name: "Rainy Day", sounds: ["rain", "cafe"] },
  { name: "Ocean Breeze", sounds: ["waves", "wind"] },
  { name: "Cozy Evening", sounds: ["fire", "rain"] },
  { name: "Forest Retreat", sounds: ["forest", "rain"] },
];

export const breathingExercises: BreathingExercise[] = [
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    description: "This technique helps reduce anxiety and helps people get to sleep.",
    steps: [
      { seconds: 4, instruction: "Inhale through your nose for 4 seconds" },
      { seconds: 7, instruction: "Hold your breath for 7 seconds" },
      { seconds: 8, instruction: "Exhale through your mouth for 8 seconds" },
    ],
    benefits: [
      "Reduces anxiety and stress",
      "Helps with falling asleep faster",
      "Improves focus and concentration",
      "Helps manage cravings",
    ],
  },
  {
    id: "box",
    name: "Box Breathing",
    description: "Used by Navy SEALs to calm down and focus in high-stress situations.",
    steps: [
      { seconds: 4, instruction: "Inhale through your nose for 4 seconds" },
      { seconds: 4, instruction: "Hold your breath for 4 seconds" },
      { seconds: 4, instruction: "Exhale through your mouth for 4 seconds" },
      { seconds: 4, instruction: "Hold your breath for 4 seconds" },
    ],
    benefits: [
      "Clears the mind",
      "Relieves stress",
      "Regulates the autonomic nervous system",
      "Improves mood and energy levels",
    ],
  },
  {
    id: "alternate-nostril",
    name: "Alternate Nostril Breathing",
    description: "A yogic breathing technique to balance the mind and reduce stress.",
    steps: [
      { seconds: 4, instruction: "Close right nostril, inhale through left nostril" },
      { seconds: 2, instruction: "Close both nostrils" },
      { seconds: 4, instruction: "Release right nostril, exhale" },
      { seconds: 4, instruction: "Inhale through right nostril" },
      { seconds: 2, instruction: "Close both nostrils" },
      { seconds: 4, instruction: "Release left nostril, exhale" },
    ],
    benefits: [
      "Balances the hemispheres of the brain",
      "Reduces stress and anxiety",
      "Promotes mental clarity",
      "Improves focus and attention",
    ],
  },
];
