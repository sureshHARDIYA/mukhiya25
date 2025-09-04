-- Remove grade column from education table
-- This migration removes the grade/GPA field from the education table

ALTER TABLE education DROP COLUMN IF EXISTS grade;

-- Add a comment to the table to document the change
COMMENT ON TABLE education IS 'Education records without grade/GPA information for privacy and simplicity';
