export interface Profile {
  id: string;
  username: string;
  current_level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  xp_reward: number;
  duration_minutes: number;
  content: ExerciseContent;
  created_at: string;
}

export interface ExerciseContent {
  type: 'breathing' | 'reflection' | 'guided' | 'affirmations' | 'observation' | 'checkin';
  instructions?: string[];
  prompt?: string;
  fields?: number;
  rounds?: number;
  statements?: string[];
  questions?: string[];
  duration?: number;
}

export interface UserExercise {
  id: string;
  user_id: string;
  exercise_id: string;
  completed_at: string;
  xp_earned: number;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  checkin_date: string;
  mood_rating: number;
  created_at: string;
}
