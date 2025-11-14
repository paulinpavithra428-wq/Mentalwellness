import { useState } from 'react';
import { Smile, Meh, Frown, Heart, Sun } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface MoodCheckinProps {
  onComplete: () => void;
}

const moods = [
  { rating: 5, icon: Heart, label: 'Amazing', color: 'from-pink-400 to-rose-500' },
  { rating: 4, icon: Sun, label: 'Good', color: 'from-yellow-400 to-orange-500' },
  { rating: 3, icon: Smile, label: 'Okay', color: 'from-blue-400 to-cyan-500' },
  { rating: 2, icon: Meh, label: 'Not Great', color: 'from-gray-400 to-gray-500' },
  { rating: 1, icon: Frown, label: 'Struggling', color: 'from-purple-400 to-indigo-500' },
];

export default function MoodCheckin({ onComplete }: MoodCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!selectedMood || !user) return;

    setSubmitting(true);
    try {
      await supabase.from('daily_checkins').insert({
        user_id: user.id,
        mood_rating: selectedMood,
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting mood:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-2">How are you feeling today?</h3>
      <p className="text-gray-600 text-sm mb-6">Take a moment to check in with yourself</p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {moods.map(({ rating, icon: Icon, label, color }) => (
          <button
            key={rating}
            onClick={() => setSelectedMood(rating)}
            className={`p-4 rounded-2xl border-2 transition-all ${
              selectedMood === rating
                ? 'border-teal-400 bg-teal-50 scale-105'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`bg-gradient-to-br ${color} p-3 rounded-xl mx-auto w-fit mb-2`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
          </button>
        ))}
      </div>

      {selectedMood && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Submit Check-in'}
        </button>
      )}
    </div>
  );
}
