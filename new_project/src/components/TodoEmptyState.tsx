import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';

const TodoEmptyState: React.FC = () => {
  return (
    <motion.div 
      className="text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="inline-flex justify-center items-center w-16 h-16 bg-blue-50 rounded-full mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <ClipboardList className="h-8 w-8 text-blue-500" />
      </motion.div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        Your task list is empty. Add a new task to get started with your productivity journey.
      </p>
    </motion.div>
  );
};

export default TodoEmptyState;