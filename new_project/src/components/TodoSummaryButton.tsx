import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import { useTodos } from '../context/TodoContext';

const TodoSummaryButton: React.FC = () => {
  const { todos, isSummarizing, summarizeTodos } = useTodos();
  const pendingTodos = todos.filter(todo => !todo.completed);
  const hasPendingTodos = pendingTodos.length > 0;

  return (
    <div>
      <motion.button
        onClick={summarizeTodos}
        disabled={isSummarizing || !hasPendingTodos}
        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${
          hasPendingTodos
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        whileHover={hasPendingTodos ? { scale: 1.02 } : {}}
        whileTap={hasPendingTodos ? { scale: 0.98 } : {}}
      >
        {isSummarizing ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Summarizing...</span>
          </>
        ) : (
          <>
            {hasPendingTodos ? (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Summarize & Send to Slack</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>No pending tasks to summarize</span>
              </>
            )}
          </>
        )}
      </motion.button>
      
      {hasPendingTodos && (
        <p className="text-xs text-gray-500 text-center mt-2">
          This will summarize {pendingTodos.length} pending task{pendingTodos.length !== 1 ? 's' : ''} and send to Slack
        </p>
      )}
    </div>
  );
};

export default TodoSummaryButton;