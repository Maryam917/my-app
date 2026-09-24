import React, { memo } from 'react';
import { Button, StyleSheet, FlatList, Text, View } from 'react-native';
import { triggerLocalNotification } from '../src/services/notificationService';
import { AnimatedCard } from '../src/components/AnimatedCard';

// Sample Data
const HABITS_DATA = [
  { id: '1', title: 'Morning Walk' },
  { id: '2', title: 'Read 10 Pages' },
  { id: '3', title: 'Code React Native' },
];

// Memoized Card Component (Re-render se bachane ke liye)
const HabitCard = memo(({ title }: { title: string }) => (
  <AnimatedCard style={styles.card}>
    <Text style={styles.cardText}>{title}</Text>
  </AnimatedCard>
));

export default function HomeScreen() {
  const handleTest = async () => {
    await triggerLocalNotification('task-101', 'Task Assigned!');
  };

  return (
    <View style={styles.container}>
      <Button title="Test Notification & Deep Link" onPress={handleTest} />

      {/* Optimized FlatList */}
      <FlatList
        data={HABITS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HabitCard title={item.title} />}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },
  listContainer: { marginTop: 20 },
  card: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  cardText: { fontSize: 16, fontWeight: '500' },
});