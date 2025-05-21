# Todo Summary Assistant

A full-stack application that allows users to create and manage personal to-do items, generate AI summaries, and send them to Slack.

## Features

- Create, edit, and delete to-do items
- Mark to-dos as completed
- Generate AI-powered summaries of pending to-dos
- Send summaries to a Slack channel
- Real-time updates with Supabase
- Beautiful, responsive UI built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API
- **Messaging**: Slack Webhooks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Supabase account
- OpenAI API key
- Slack Webhook URL

### Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your API keys
4. Connect to Supabase (click the "Connect to Supabase" button in StackBlitz)
5. Run the migrations to create the database schema
6. Start the development server:
   ```
   npm run dev
   ```
7. In a separate terminal, start the backend server:
   ```
   npm run server
   ```

## Supabase Setup

The application uses Supabase for database storage. The database schema is defined in the `supabase/migrations` directory.

## Slack Integration

To set up Slack integration:

1. Go to [Slack API Apps page](https://api.slack.com/apps)
2. Create a new app (or select an existing one)
3. Navigate to "Incoming Webhooks" and activate them
4. Create a new webhook for a specific channel
5. Copy the webhook URL and paste it in your `.env` file as `SLACK_WEBHOOK_URL`

## OpenAI Integration

1. Get an API key from [OpenAI](https://platform.openai.com/account/api-keys)
2. Add the key to your `.env` file as `OPENAI_API_KEY`

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
SLACK_WEBHOOK_URL=your-slack-webhook-url
```

## API Endpoints

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Add a new todo
- `DELETE /api/todos/:id` - Delete a todo
- `POST /api/summarize` - Summarize todos and send to Slack

## License

MIT