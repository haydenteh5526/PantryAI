import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

function ShimmerBlock({ width, height, rounded = 8 }: { width: string | number; height: number; rounded?: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{ width: width as any, height, borderRadius: rounded, backgroundColor: "#CAD2C5", opacity }}
    />
  );
}

export function RecipeDetailSkeleton() {
  return (
    <View className="flex-1 bg-background px-6 pt-24">
      <ShimmerBlock width="70%" height={32} />
      <View style={{ height: 12 }} />
      <ShimmerBlock width="40%" height={20} />
      <View style={{ height: 32 }} />
      <ShimmerBlock width="50%" height={24} />
      <View style={{ height: 16 }} />
      <ShimmerBlock width="100%" height={180} rounded={16} />
      <View style={{ height: 32 }} />
      <ShimmerBlock width="50%" height={24} />
      <View style={{ height: 16 }} />
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <ShimmerBlock width="100%" height={56} rounded={12} />
        </View>
      ))}
    </View>
  );
}

export function HistorySkeleton() {
  return (
    <View className="px-6 py-6">
      {[1, 2, 3].map((i) => (
        <View key={i} className="bg-surface rounded-2xl p-4 mb-4">
          <ShimmerBlock width="60%" height={22} />
          <View style={{ height: 8 }} />
          <ShimmerBlock width="40%" height={14} />
          <View style={{ height: 12 }} />
          <ShimmerBlock width="100%" height={40} rounded={12} />
        </View>
      ))}
    </View>
  );
}
