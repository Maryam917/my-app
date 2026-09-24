export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export type UIState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
  