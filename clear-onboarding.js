import AsyncStorage from '@react-native-async-storage/async-storage';

async function clearOnboarding() {
  try {
    await AsyncStorage.removeItem('hasSeenOnboarding');
    console.log('Onboarding flag cleared! Restart the app to see onboarding.');
  } catch (error) {
    console.error('Failed to clear:', error);
  }
}

clearOnboarding();
