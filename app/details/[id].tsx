import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NetworkBanner } from '../../src/components/NetworkBanner';
import { useToggleTask } from '../../src/features/habits/useTasks';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const toggleTaskMutation = useToggleTask();

  const handleToggle = () => {
    toggleTaskMutation.mutate({
      id: String(id),
      completed: true,
    });
  };

  return (
    <View style={styles.container}>
      <NetworkBanner />
      <View style={styles.content}>
        <Text>Task ID: {id}</Text>
        <Button title="Toggle Task Status" onPress={handleToggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});