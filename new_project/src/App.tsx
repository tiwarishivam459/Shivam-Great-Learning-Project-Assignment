import React from 'react';
import { Toaster } from 'react-hot-toast';
import { TodoProvider } from './context/TodoContext';
import Layout from './components/Layout';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <TodoProvider>
      <Layout>
        <TodoApp />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Layout>
    </TodoProvider>
  );
}

export default App;