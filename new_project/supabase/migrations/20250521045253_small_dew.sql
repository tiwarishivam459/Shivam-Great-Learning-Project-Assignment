/*
  # Add indexes to todos table

  1. Changes
    - Add indexes to improve query performance on commonly accessed columns
    - Add comment to the table for better documentation
  
  2. Notes
    - Policies are already created in the previous migration
    - Only adding performance improvements
*/

-- Add useful indexes
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Add table comment
COMMENT ON TABLE todos IS 'Stores user todo items with completion status';