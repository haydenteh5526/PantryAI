import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { View, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";

interface NetworkState {
  isConnected: boolean;
}

const NetworkContext = createContext<NetworkState>({ isConnected: true });

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {!isConnected && (
        <View className="bg-danger px-4 py-2 flex-row items-center justify-center" style={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 999 }}>
          <Ionicons name="cloud-offline" size={16} color="#FFFFFF" />
          <Text className="text-surface text-sm font-semibold ml-2">No internet connection</Text>
        </View>
      )}
      {children}
    </NetworkContext.Provider>
  );
}

export const useNetwork = () => useContext(NetworkContext);
