import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';
import { useTodos } from '../context/TodoContext';

const TodoList: React.FC = () => {
  const { todos } = useTodos();

  // Calculate stats
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;
  const completionPercentage = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between mb-4 text-sm text-gray-600">
        <div className="flex space-x-4">
          <span className="text-blue-600 font-medium">{pendingCount} pending</span>
          <span className="text-green-600 font-medium">{completedCount} completed</span>
        </div>
        <span className="font-medium">{completionPercentage}% done</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence>
        {todos.map(todo => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TodoItem todo={todo} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TodoList;