import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to send a message to Slack
async function sendToSlack(message) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!slackWebhookUrl) {
    throw new Error('SLACK_WEBHOOK_URL environment variable is not set');
  }
  
  const response = await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to send message to Slack: ${response.statusText}`);
  }
  
  return response;
}

// API Routes
// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const newTodo = {
      content,
      completed: false,
    };
    
    const { data, error } = await supabase
      .from('todos')
      .insert([newTodo])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Summarize todos and send to Slack
app.post('/api/summarize', async (req, res) => {
  try {
    // Validate required environment variables
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    if (!process.env.SLACK_WEBHOOK_URL) {
      throw new Error('SLACK_WEBHOOK_URL environment variable is not set');
    }

    const { todos } = req.body;
    
    if (!todos || !Array.isArray(todos) || todos.length === 0) {
      return res.status(400).json({ error: 'No todos provided for summarization' });
    }
    
    // Generate todo list text for OpenAI
    const todoListText = todos
      .map(todo => `- ${todo.content}`)
      .join('\n');
    
    // Generate a summary with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that summarizes to-do lists into concise, actionable summaries with priority insights."
        },
        {
          role: "user",
          content: `Please summarize the following to-do list in a few sentences. Identify main themes, priorities, and group similar tasks. Return a concise, professional summary suitable for sharing with colleagues:\n\n${todoListText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const summary = completion.choices[0].message.content;
    
    // Format message for Slack
    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "📋 Todo Summary",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*AI-Generated Summary:*\n${summary}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Pending Tasks:*"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: todoListText
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Generated by Todo Summary Assistant | ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };
    
    // Send to Slack
    await sendToSlack(slackMessage);
    
    res.json({ 
      success: true, 
      message: 'Summary sent to Slack successfully',
      summary 
    });
  } catch (error) {
    console.error('Error summarizing todos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to summarize todos';
    res.status(500).json({ error: errorMessage });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;