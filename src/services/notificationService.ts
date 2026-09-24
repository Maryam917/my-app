import Constants, { ExecutionEnvironment } from 'expo-constants';
import { router } from 'expo-router';
import { Alert } from 'react-native';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const triggerLocalNotification = async (taskId: string, title: string) => {
  if (isExpoGo) {
    // Expo Go test flow: Alert ke baad direct details screen par navigate karein
    Alert.alert(
      'Expo Go Test Mode',
      'Expo Go mein direct Deep Link screen par redirect kiya ja raha hai.',
      [
        {
          text: 'Open Screen',
          onPress: () => router.push(`/details/${taskId}` as any),
        },
      ]
    );
    return;
  }

  try {
    const Notifications: any = await import('expo-notifications');

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: 'Tap to view task details.',
        data: { taskId, screen: 'details' },
      },
      trigger: null,
    });
  } catch (error) {
    console.warn('Local notification failed:', error);
  }
};