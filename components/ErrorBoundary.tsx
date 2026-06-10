import { Component, type ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Sentry } from "@/lib/sentry";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) console.error("ErrorBoundary caught:", error);
    Sentry.captureException(error);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Ionicons name="warning" size={64} color="#E76F51" />
        <Text className="text-text text-2xl font-bold text-center mt-6 mb-2">Something went wrong</Text>
        <Text className="text-text/60 text-center mb-8">
          {__DEV__ ? this.state.error?.message : "An unexpected error occurred. Please try again."}
        </Text>
        <TouchableOpacity onPress={this.reset} className="bg-primary px-8 py-4 rounded-2xl">
          <Text className="text-surface font-bold text-lg">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
