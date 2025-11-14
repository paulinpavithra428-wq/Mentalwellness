import { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ExerciseCard from './ExerciseCard';
import ExerciseModal from './ExerciseModal';
import { Award, Sparkles } from 'lucide-react';

export default function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReward, setShowReward] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('difficulty');

    if (!error && data) {
      setExercises(data);
    }
    setLoading(false);
  };

  const calculateStreak = async () => {
    if (!user || !profile) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const { data: todayCheckin } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('checkin_date', today)
      .maybeSingle();

    if (todayCheckin) {
      return;
    }

    const lastActivityDate = profile.last_activity_date;
    let newStreak = profile.current_streak;

    if (!lastActivityDate) {
      newStreak = 1;
    } else if (lastActivityDate === yesterday) {
      newStreak = profile.current_streak + 1;
    } else if (lastActivityDate !== today) {
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, profile.longest_streak);

    await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_activity_date: today,
      })
      .eq('id', user.id);
  };

  const handleCompleteExercise = async () => {
    if (!selectedExercise || !user || !profile) return;

    const xpEarned = selectedExercise.xp_reward;
    const newTotalXP = profile.total_xp + xpEarned;
    const newLevel = Math.floor(newTotalXP / 100) + 1;

    await supabase.from('user_exercises').insert({
      user_id: user.id,
      exercise_id: selectedExercise.id,
      xp_earned: xpEarned,
    });

    await supabase
      .from('profiles')
      .update({
        total_xp: newTotalXP,
        current_level: newLevel,
      })
      .eq('id', user.id);

    await calculateStreak();
    await refreshProfile();

    setEarnedXP(xpEarned);
    setShowReward(true);
    setSelectedExercise(null);

    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Exercises</h2>
        <p className="text-gray-600">Choose an exercise to improve your wellbeing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onStart={setSelectedExercise}
          />
        ))}
      </div>

      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onComplete={handleCompleteExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-bounce">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full">
                <Award className="w-12 h-12 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Great Job!</h3>
                <p className="text-gray-600 flex items-center gap-2 justify-center">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="text-xl font-bold text-yellow-600">+{earnedXP} XP</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
