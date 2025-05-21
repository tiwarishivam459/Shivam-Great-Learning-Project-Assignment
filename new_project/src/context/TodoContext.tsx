import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Todo } from '../types';

interface TodoContextProps {
  todos: Todo[];
  isLoading: boolean;
  isSummarizing: boolean;
  fetchTodos: () => Promise<void>;
  addTodo: (content: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  summarizeTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextProps | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (content: string) => {
    try {
      const newTodo: Omit<Todo, 'id' | 'created_at'> = {
        content,
        completed: false,
      };
      
      const { data, error } = await supabase
        .from('todos')
        .insert([newTodo])
        .select();
      
      if (error) throw error;
      
      setTodos(prev => [data![0], ...prev]);
      toast.success('Todo added successfully');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo');
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setTodos(prev => 
        prev.map(todo => (todo.id === id ? { ...todo, ...updates } : todo))
      );
      
      toast.success('Todo updated');
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast.success('Todo deleted');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const summarizeTodos = async () => {
    try {
      setIsSummarizing(true);
      const pendingTodos = todos.filter(todo => !todo.completed);
      
      if (pendingTodos.length === 0) {
        toast.success('No pending todos to summarize');
        return;
      }
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todos: pendingTodos }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server error:', data.error);
        throw new Error(data.error || 'Failed to summarize todos');
      }
      
      toast.success('Summary sent to Slack!');
    } catch (error) {
      console.error('Error summarizing todos:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to summarize todos');
    } finally {
      setIsSummarizing(false);
    }
  };

  const value = {
    todos,
    isLoading,
    isSummarizing,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    summarizeTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};