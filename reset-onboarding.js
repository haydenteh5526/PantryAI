// Run this to see onboarding again
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

AsyncStorage.removeItem('hasSeenOnboarding')
  .then(() => console.log('✅ Onboarding reset! Reload the app to see it again.'))
  .catch(err => console.error('❌ Error:', err));
