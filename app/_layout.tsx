import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../src/features/auth/AuthContext';

// Direct QueryClient Instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    if (isExpoGo) return;

    const setupNotifications = async () => {
      try {
        const Notifications: any = await import('expo-notifications');
        const { requestNotificationPermissions } = await import('../src/utils/useNotificationPermissions');
        await requestNotificationPermissions();

        const subscription = Notifications.addNotificationResponseReceivedListener((response: any) => {
          const data = response.notification.request.content.data;
          if (data?.screen === 'details' && data?.taskId) {
            router.push(`/details/${data.taskId}` as any);
          }
        });

        return () => subscription.remove();
      } catch (error) {
        console.warn('Notifications setup skipped:', error);
      }
    };

    setupNotifications();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="details/[id]" />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}