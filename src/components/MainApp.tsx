import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Dashboard from './Dashboard';
import ExerciseList from './ExerciseList';
import MoodCheckin from './MoodCheckin';

export default function MainApp() {
  const { user } = useAuth();
  const [showMoodCheckin, setShowMoodCheckin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTodaysMoodCheckin();
  }, [user]);

  const checkTodaysMoodCheckin = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('checkin_date', today)
      .maybeSingle();

    setShowMoodCheckin(!data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Dashboard />

        {showMoodCheckin && (
          <MoodCheckin
            onComplete={() => {
              setShowMoodCheckin(false);
            }}
          />
        )}

        <ExerciseList />
      </div>
    </div>
  );
}
