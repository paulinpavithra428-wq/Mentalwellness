/*
  # Mental Wellness App Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `current_level` (integer, default 1)
      - `total_xp` (integer, default 0)
      - `current_streak` (integer, default 0)
      - `longest_streak` (integer, default 0)
      - `last_activity_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `exercises`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `difficulty` (integer, 1-5)
      - `xp_reward` (integer)
      - `duration_minutes` (integer)
      - `content` (jsonb)
      - `created_at` (timestamptz)
    
    - `user_exercises`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `exercise_id` (uuid, references exercises)
      - `completed_at` (timestamptz)
      - `xp_earned` (integer)
    
    - `daily_checkins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `checkin_date` (date)
      - `mood_rating` (integer, 1-5)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for exercises table
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  current_level integer DEFAULT 1,
  total_xp integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty integer NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  xp_reward integer NOT NULL DEFAULT 10,
  duration_minutes integer NOT NULL DEFAULT 5,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS user_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  xp_earned integer NOT NULL,
  UNIQUE(user_id, exercise_id, completed_at)
);

ALTER TABLE user_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completed exercises"
  ON user_exercises FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed exercises"
  ON user_exercises FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS daily_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checkin_date date NOT NULL DEFAULT CURRENT_DATE,
  mood_rating integer NOT NULL CHECK (mood_rating BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, checkin_date)
);

ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checkins"
  ON daily_checkins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins"
  ON daily_checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

INSERT INTO exercises (title, description, category, difficulty, xp_reward, duration_minutes, content)
VALUES 
  ('Deep Breathing', 'Practice calming breath work to reduce stress and anxiety', 'Breathing', 1, 10, 3, '{"type": "breathing", "instructions": ["Sit comfortably and close your eyes", "Breathe in slowly for 4 counts", "Hold for 4 counts", "Breathe out slowly for 6 counts", "Repeat 5 times"], "rounds": 5}'::jsonb),
  ('Gratitude Reflection', 'Take a moment to appreciate the positive things in your life', 'Gratitude', 1, 15, 5, '{"type": "reflection", "prompt": "List three things you''re grateful for today", "fields": 3}'::jsonb),
  ('Body Scan Meditation', 'Connect with your body and release tension', 'Meditation', 2, 20, 7, '{"type": "guided", "instructions": ["Lie down or sit comfortably", "Focus on your toes, notice any sensations", "Slowly move your attention up through your legs", "Continue up through your body to your head", "Notice any areas of tension and breathe into them"], "duration": 420}'::jsonb),
  ('Positive Affirmations', 'Reinforce positive self-beliefs and boost confidence', 'Affirmations', 1, 10, 3, '{"type": "affirmations", "statements": ["I am capable and strong", "I deserve happiness and peace", "I choose to focus on what I can control", "I am growing and learning every day", "I am worthy of love and respect"]}'::jsonb),
  ('Mindful Observation', 'Practice present-moment awareness by observing your surroundings', 'Mindfulness', 2, 15, 5, '{"type": "observation", "instructions": ["Find a comfortable spot", "Choose an object to focus on", "Notice its colors, textures, and details", "If your mind wanders, gently bring it back", "Continue for 5 minutes"]}'::jsonb),
  ('Emotional Check-in', 'Identify and acknowledge your current emotions', 'Self-Awareness', 2, 20, 5, '{"type": "checkin", "questions": ["What emotion am I feeling right now?", "Where do I feel it in my body?", "What triggered this emotion?", "What do I need right now?"]}'::jsonb)
ON CONFLICT DO NOTHING;