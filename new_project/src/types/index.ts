export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  created_at: string;
}

export interface SlackMessage {
  text: string;
  blocks?: Array<{
    type: string;
    text?: {
      type: string;
      text: string;
    };
    fields?: Array<{
      type: string;
      text: string;
    }>;
  }>;
}