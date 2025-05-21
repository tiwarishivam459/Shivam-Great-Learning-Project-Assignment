import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Edit, Save } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(todo.content);
  const { updateTodo, deleteTodo } = useTodos();

  const handleToggleComplete = () => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedContent(todo.content);
  };

  const handleSaveEdit = () => {
    if (editedContent.trim() !== '') {
      updateTodo(todo.id, { content: editedContent });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedContent(todo.content);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'todo-item-completed' : 'todo-item-pending'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-start flex-grow mr-2">
          <button
            onClick={handleToggleComplete}
            className={`flex-shrink-0 mt-1 mr-3 ${
              todo.completed ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-blue-500'
            }`}
          >
            {todo.completed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          {isEditing ? (
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input flex-grow py-1"
              autoFocus
            />
          ) : (
            <p
              className={`flex-grow ${
                todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
              }`}
            >
              {todo.content}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <motion.button
              onClick={handleSaveEdit}
              className="text-green-500 hover:text-green-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Save className="h-5 w-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleStartEdit}
              className="text-gray-400 hover:text-blue-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-testid={`edit-todo-${todo.id}`}
            >
              <Edit className="h-5 w-5" />
            </motion.button>
          )}

          <motion.button
            onClick={() => deleteTodo(todo.id)}
            className="text-gray-400 hover:text-red-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            data-testid={`delete-todo-${todo.id}`}
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;