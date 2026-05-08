-- Add CPF column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cpf TEXT;