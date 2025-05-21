/*
  # Create todos table

  1. New Tables
    - `todos`
      - `id` (uuid, primary key)
      - `content` (text, not null)
      - `completed` (boolean, default: false)
      - `created_at` (timestamp with time zone, default: now())
  
  2. Security
    - Enable RLS on `todos` table
    - Add policy for authenticated users to perform CRUD operations on their own todos
*/

CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy for reading todos (any authenticated user can read all todos in this simple app)
CREATE POLICY "Anyone can read todos" 
  ON todos
  FOR SELECT
  USING (true);

-- Policy for inserting todos
CREATE POLICY "Anyone can create todos" 
  ON todos
  FOR INSERT
  WITH CHECK (true);

-- Policy for updating todos
CREATE POLICY "Anyone can update todos" 
  ON todos
  FOR UPDATE
  USING (true);

-- Policy for deleting todos
CREATE POLICY "Anyone can delete todos" 
  ON todos
  FOR DELETE
  USING (true);