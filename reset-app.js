// Run this in your app to simulate fresh install
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.multiRemove([
  'hasSeenOnboarding',
  'userMode', 
  'userEmail',
  'userName'
]).then(() => {
  console.log('✅ App reset - restart to see onboarding');
});
