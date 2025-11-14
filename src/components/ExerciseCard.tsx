import { Exercise } from '../types';
import { Clock, Zap, Star } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: (exercise: Exercise) => void;
}

const categoryColors: Record<string, string> = {
  Breathing: 'from-blue-400 to-cyan-500',
  Gratitude: 'from-pink-400 to-rose-500',
  Meditation: 'from-purple-400 to-indigo-500',
  Affirmations: 'from-yellow-400 to-orange-500',
  Mindfulness: 'from-green-400 to-emerald-500',
  'Self-Awareness': 'from-teal-400 to-blue-500',
};

export default function ExerciseCard({ exercise, onStart }: ExerciseCardProps) {
  const difficultyStars = Array(exercise.difficulty).fill(0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`bg-gradient-to-br ${categoryColors[exercise.category] || 'from-gray-400 to-gray-500'} px-3 py-1 rounded-full text-xs font-semibold text-white`}
        >
          {exercise.category}
        </div>
        <div className="flex gap-1">
          {difficultyStars.map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">{exercise.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exercise.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{exercise.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-yellow-600">+{exercise.xp_reward} XP</span>
          </div>
        </div>

        <button
          onClick={() => onStart(exercise)}
          className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-md transition text-sm"
        >
          Start
        </button>
      </div>
    </div>
  );
}
