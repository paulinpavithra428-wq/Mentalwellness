import { useAuth } from '../contexts/AuthContext';
import { Flame, Trophy, Sparkles, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { profile, signOut } = useAuth();

  if (!profile) return null;

  const xpForNextLevel = profile.current_level * 100;
  const progress = (profile.total_xp % xpForNextLevel) / xpForNextLevel * 100;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 p-6 rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hello, {profile.username}!</h2>
          <p className="text-gray-600">Keep up your amazing progress</p>
        </div>
        <button
          onClick={signOut}
          className="p-2 hover:bg-white/50 rounded-xl transition"
          title="Sign out"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-xl">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-800">{profile.current_streak} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Level</p>
              <p className="text-2xl font-bold text-gray-800">{profile.current_level}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-teal-400 to-blue-500 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total XP</p>
              <p className="text-2xl font-bold text-gray-800">{profile.total_xp}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-gray-800">Level Progress</p>
          <p className="text-sm text-gray-600">
            {profile.total_xp % xpForNextLevel} / {xpForNextLevel} XP
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {profile.longest_streak > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Longest streak: <span className="font-semibold text-orange-600">{profile.longest_streak} days</span>
          </p>
        </div>
      )}
    </div>
  );
}
