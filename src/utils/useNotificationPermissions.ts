import { Alert, Linking } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (isExpoGo) {
    console.warn('Notification permissions are disabled in Expo Go SDK 53.');
    return false;
  }

  try {
    const Notifications: any = await import('expo-notifications');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in settings to receive updates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Permissions request failed:', error);
    return false;
  }
};