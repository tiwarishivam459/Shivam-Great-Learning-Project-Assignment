import React from 'react';
import { motion } from 'framer-motion';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import TodoSummaryButton from './TodoSummaryButton';
import TodoEmptyState from './TodoEmptyState';
import { useTodos } from '../context/TodoContext';

const TodoApp: React.FC = () => {
  const { todos, isLoading } = useTodos();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
          <TodoForm />
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : todos.length > 0 ? (
            <TodoList />
          ) : (
            <TodoEmptyState />
          )}
        </motion.div>
      </div>
      
      <motion.div
        className="md:col-span-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="text-gray-600 mb-4">
            Generate a summary of your pending tasks and send it to your Slack channel with a single click.
          </p>
          <TodoSummaryButton />
        </div>
        
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">About this app</h3>
          <p className="text-sm text-blue-700 mb-3">
            This Todo Summary Assistant helps you manage your tasks and uses AI to summarize your pending todos for quick sharing with your team.
          </p>
          <div className="text-xs text-blue-600">
            <p>• Create, update, and delete tasks</p>
            <p>• Mark tasks as completed</p>
            <p>• Generate AI summaries with OpenAI</p>
            <p>• Share summaries via Slack</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TodoApp;