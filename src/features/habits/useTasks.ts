import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleTaskApi } from '../../services/apiClient'; 

// Task Toggle Hook with Optimistic Updates
export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTaskApi,
    onMutate: async (updatedTask: { id: string; completed: boolean }) => {
      // Background queries cancel karein
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Rollback ke liye purana state save karein
      const previousTasks = queryClient.getQueryData(['tasks']);

      // UI instantly update karein
      queryClient.setQueryData(['tasks'], (old: any) =>
        old?.map((task: any) =>
          task.id === updatedTask.id ? { ...task, completed: updatedTask.completed } : task
        )
      );

      return { previousTasks };
    },
    onError: (err, newTodo, context) => {
      // Error aane par purana state wapas layein
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      // Sync with server
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}