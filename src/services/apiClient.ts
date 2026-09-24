const BASE_URL = 'https://jsonplaceholder.typicode.com';
const DEFAULT_TIMEOUT = 5000; // 5 seconds

export async function fetchWithTimeout<T>(
  endpoint: string, 
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, ...customConfig } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...customConfig,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...customConfig.headers,
      },
    });

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection.');
    }
    throw new Error(error.message || 'Something went wrong.');
  }
}
export async function postData<T, B>(
  endpoint: string, 
  body: B, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`https://jsonplaceholder.typicode.com${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Failed to create item. Status: ${response.status}`);
  }

  return await response.json();
}
export const toggleTaskApi = async (task: { id: string; completed: boolean }) => {
  return await fetchWithTimeout(`/todos/${task.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: task.completed }),
  });
};

export const addTaskApi = async (title: string) => {
  return await fetchWithTimeout('/todos', {
    method: 'POST',
    body: JSON.stringify({ title, completed: false, userId: 1 }),
  });
};