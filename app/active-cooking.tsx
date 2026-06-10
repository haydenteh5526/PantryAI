import { View, Text, TouchableOpacity, Alert, ScrollView, Animated } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import { useKeepAwake } from "expo-keep-awake";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";

interface Timer {
  id: string;
  label: string;
  duration: number; // in seconds
  remaining: number;
  isPaused: boolean;
}

export default function ActiveCookingScreen() {
  useKeepAwake(); // Keep screen awake during cooking
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [timers, setTimers] = useState<Timer[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // Parse recipe data
  const recipe = {
    title: params.title as string,
    steps: JSON.parse(params.steps as string) as string[],
  };

  // Animation for step transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const lastTimerCueAt = useRef(0);

  const playTimerDoneCue = () => {
    // prevent multiple timers finishing at once from stacking speech
    const now = Date.now();
    if (now - lastTimerCueAt.current < 800) return;
    lastTimerCueAt.current = now;

    Speech.stop();
    Speech.speak("Timer done", {
      rate: 0.95,
      pitch: 1.05,
      language: "en-US",
    });
  };

  // Extract time from step text (e.g., "Cook for 15 minutes")
  const extractTime = (text: string): { duration: number; label: string } | null => {
    const patterns = [
      /(\d+)\s*minute(?:s)?/i,
      /(\d+)\s*min(?:s)?/i,
      /(\d+)\s*hour(?:s)?/i,
      /(\d+)\s*hr(?:s)?/i,
      /(\d+)\s*second(?:s)?/i,
      /(\d+)\s*sec(?:s)?/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[0].toLowerCase();
        
        let seconds = 0;
        if (unit.includes('hour') || unit.includes('hr')) {
          seconds = value * 3600;
        } else if (unit.includes('minute') || unit.includes('min')) {
          seconds = value * 60;
        } else if (unit.includes('second') || unit.includes('sec')) {
          seconds = value;
        }
        
        return { duration: seconds, label: match[0] };
      }
    }
    return null;
  };

  // Auto-detect and create timer when step changes
  useEffect(() => {
    const currentStepText = recipe.steps[currentStep];
    const timeInfo = extractTime(currentStepText);
    
    if (timeInfo) {
      // Check if timer already exists for this step
      const existingTimer = timers.find(t => t.label === `Step ${currentStep + 1}: ${timeInfo.label}`);
      if (!existingTimer) {
        if (__DEV__) console.log(`[TIMER] Detected timer in step ${currentStep + 1}: ${timeInfo.label}`);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [currentStep]);

  // Timer countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.isPaused || timer.remaining <= 0) return timer;

          const newRemaining = timer.remaining - 1;
          
          // Timer finished
          if (newRemaining <= 0) {
            if (__DEV__) console.log(`[TIMER] Timer finished: ${timer.label}`);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Timer Done!", timer.label, [{ text: "OK" }]);
            playTimerDoneCue();
          }
          
          return { ...timer, remaining: newRemaining };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [voiceEnabled]);

  // Speak current step when voice is enabled and step changes
  useEffect(() => {
    if (voiceEnabled) {
      Speech.stop(); // Stop any ongoing speech
      const stepText = recipe.steps[currentStep];
      Speech.speak(`Step ${currentStep + 1}. ${stepText}`, { 
        rate: 0.75,
        pitch: 0.95,
        language: 'en-US',
      });
    }
  }, [currentStep, voiceEnabled]);

  const goToNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Animate transition
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Animate transition
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentStep(currentStep - 1);
    }
  };

  const repeatStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (voiceEnabled) {
      Speech.stop();
      const stepText = recipe.steps[currentStep];
      Speech.speak(`Step ${currentStep + 1}. ${stepText}`, { 
        rate: 0.75,
        pitch: 0.95,
        language: 'en-US',
      });
    }
  };

  const addTimer = () => {
    const currentStepText = recipe.steps[currentStep];
    const timeInfo = extractTime(currentStepText);
    
    if (!timeInfo) {
      return; // Should never happen since button is only shown when time exists
    }

    const newTimer: Timer = {
      id: Date.now().toString(),
      label: `Step ${currentStep + 1}: ${timeInfo.label}`,
      duration: timeInfo.duration,
      remaining: timeInfo.duration,
      isPaused: false,
    };

    setTimers([...timers, newTimer]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (voiceEnabled) {
      Speech.speak(`Timer started for ${timeInfo.label}`, { 
        rate: 0.8,
        pitch: 0.95,
        language: 'en-US',
      });
    }
  };

  const removeTimer = (id: string) => {
    setTimers(timers.filter((t) => t.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleTimerPause = (id: string) => {
    setTimers(
      timers.map((t) =>
        t.id === id ? { ...t, isPaused: !t.isPaused } : t
      )
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    Speech.stop();
    Alert.alert(
      "Exit Cooking Mode?",
      "Are you sure you want to exit? All timers will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleFinish = () => {
    Speech.stop();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Navigate to completion screen with recipe data
    router.push({
      pathname: "/cooking-complete",
      params: {
        title: recipe.title,
        steps: JSON.stringify(recipe.steps),
      },
    });
  };

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-16 pb-4 px-6 border-b border-muted">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={handleExit}>
            <Ionicons name="close" size={28} color="#2F3E46" />
          </TouchableOpacity>
          
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setVoiceEnabled(!voiceEnabled);
                if (!voiceEnabled) {
                  Speech.stop();
                  const stepText = recipe.steps[currentStep];
                  Speech.speak(`Step ${currentStep + 1}. ${stepText}`, { 
                    rate: 0.75,
                    pitch: 0.95,
                    language: 'en-US',
                  });
                } else {
                  Speech.stop();
                }
              }}
              className={`p-2 rounded-full ${voiceEnabled ? 'bg-green-500' : 'bg-surface'}`}
            >
              <Ionicons 
                name={voiceEnabled ? "volume-high" : "volume-mute"} 
                size={24} 
                color="#2F3E46" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-2">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text/60 text-sm">
              Step {currentStep + 1} of {recipe.steps.length}
            </Text>
            <Text className="text-text/60 text-sm">
              {Math.round(progress)}%
            </Text>
          </View>
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 py-6">
        {/* Current Step */}
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="mb-6"
        >
          <View className="bg-surface rounded-3xl p-8">
            <View className="items-center mb-6">
              <View className="bg-primary w-16 h-16 rounded-full items-center justify-center">
                <Text className="text-surface text-2xl font-bold">
                  {currentStep + 1}
                </Text>
              </View>
            </View>
            
            <Text className="text-text text-xl font-medium leading-8 text-center">
              {recipe.steps[currentStep].replace(/\*\*/g, '').replace(/\*/g, '')}
            </Text>
          </View>
        </Animated.View>

        {/* Timer Section */}
        {timers.length > 0 && (
          <View className="mb-6">
            <Text className="text-text text-lg font-semibold mb-3">
              Active Timers
            </Text>
            {timers.map((timer) => (
              <View
                key={timer.id}
                className="bg-surface rounded-2xl p-4 mb-3 flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-text/60 text-sm mb-1">
                    {timer.label}
                  </Text>
                  <Text className={`text-3xl font-bold ${
                    timer.remaining <= 10 ? 'text-danger' : 
                    timer.remaining <= 60 ? '#D97706' : 
                    'text-text'
                  }`} style={{
                    color: timer.remaining <= 10 ? '#E76F51' : 
                           timer.remaining <= 60 ? '#D97706' : 
                           '#2F3E46'
                  }}>
                    {formatTime(timer.remaining)}
                  </Text>
                </View>
                
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => toggleTimerPause(timer.id)}
                    className="bg-background p-3 rounded-full"
                  >
                    <Ionicons
                      name={timer.isPaused ? "play" : "pause"}
                      size={20}
                      color="#2F3E46"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeTimer(timer.id)}
                    className="bg-background p-3 rounded-full"
                  >
                    <Ionicons name="trash" size={20} color="#E76F51" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View className="mb-6">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={repeatStep}
              className="flex-1 bg-surface py-4 rounded-xl items-center"
            >
              <Ionicons name="refresh" size={24} color="#2F3E46" />
              <Text className="text-text mt-2 font-medium">Repeat</Text>
            </TouchableOpacity>
            
            {extractTime(recipe.steps[currentStep]) && (
              <TouchableOpacity
                onPress={addTimer}
                className="flex-1 bg-surface py-4 rounded-xl items-center"
              >
                <Ionicons name="timer" size={24} color="#2F3E46" />
                <Text className="text-text mt-2 font-medium">Add Timer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 pb-8 pt-6 mt-4 border-t border-muted">
        <View className="flex-row gap-3 mb-3">
          <TouchableOpacity
            onPress={goToPreviousStep}
            disabled={currentStep === 0}
            className={`flex-1 py-5 rounded-2xl items-center ${
              currentStep === 0 ? "bg-surface opacity-50" : "bg-surface"
            }`}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={currentStep === 0 ? "#CAD2C5" : "#2F3E46"}
            />
            <Text
              className={`mt-2 font-semibold ${
                currentStep === 0 ? "text-text/60" : "text-text"
              }`}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextStep}
            disabled={currentStep === recipe.steps.length - 1}
            className={`flex-1 py-5 rounded-2xl items-center ${
              currentStep === recipe.steps.length - 1
                ? "bg-surface opacity-50"
                : "bg-primary"
            }`}
          >
            <Ionicons
              name="chevron-forward"
              size={28}
              color={currentStep === recipe.steps.length - 1 ? "#CAD2C5" : "#FFFFFF"}
            />
            <Text
              className={`mt-2 font-semibold ${
                currentStep === recipe.steps.length - 1
                  ? "text-text/60"
                  : "text-surface"
              }`}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>

        {currentStep === recipe.steps.length - 1 && (
          <TouchableOpacity
            onPress={handleFinish}
            className="bg-green-500 py-5 rounded-2xl items-center active:opacity-80"
          >
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={28} color="#FFFFFF" />
              <Text className="text-surface font-bold text-lg ml-2">
                Finish Cooking
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
