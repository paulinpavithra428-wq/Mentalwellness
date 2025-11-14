import { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { X, Check } from 'lucide-react';

interface ExerciseModalProps {
  exercise: Exercise;
  onComplete: () => void;
  onClose: () => void;
}

export default function ExerciseModal({ exercise, onComplete, onClose }: ExerciseModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['', '', '']);
  const [answers, setAnswers] = useState<string[]>([]);

  const content = exercise.content;

  useEffect(() => {
    if (content.type === 'checkin' && content.questions) {
      setAnswers(new Array(content.questions.length).fill(''));
    }
  }, [content]);

  const handleComplete = async () => {
    setIsCompleting(true);
    await onComplete();
    setIsCompleting(false);
  };

  const renderContent = () => {
    switch (content.type) {
      case 'breathing':
        if (!content.instructions) return null;
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Follow these steps:</h3>
              <ol className="space-y-3">
                {content.instructions.map((instruction, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="text-center text-gray-600">
              Complete {content.rounds} rounds of this breathing pattern
            </p>
          </div>
        );

      case 'reflection':
        return (
          <div className="space-y-4">
            <p className="text-lg text-gray-700 mb-6">{content.prompt}</p>
            {gratitudeItems.map((item, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {i + 1}. What are you grateful for?
                </label>
                <textarea
                  value={item}
                  onChange={(e) => {
                    const newItems = [...gratitudeItems];
                    newItems[i] = e.target.value;
                    setGratitudeItems(newItems);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none"
                  rows={2}
                  placeholder="Type your thoughts..."
                />
              </div>
            ))}
          </div>
        );

      case 'guided':
        if (!content.instructions) return null;
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Meditation Guide:</h3>
              <ol className="space-y-3">
                {content.instructions.map((instruction, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        );

      case 'affirmations':
        if (!content.statements) return null;
        return (
          <div className="space-y-6">
            <p className="text-gray-700 text-center mb-4">
              Read each affirmation slowly and let it resonate with you
            </p>
            <div className="space-y-4">
              {content.statements.map((statement, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 text-center"
                >
                  <p className="text-lg font-medium text-gray-800">{statement}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'observation':
        if (!content.instructions) return null;
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Observation Practice:</h3>
              <ol className="space-y-3">
                {content.instructions.map((instruction, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        );

      case 'checkin':
        if (!content.questions) return null;
        return (
          <div className="space-y-4">
            {content.questions.map((question, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {question}
                </label>
                <textarea
                  value={answers[i] || ''}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[i] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none"
                  rows={3}
                  placeholder="Reflect and respond..."
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{exercise.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{exercise.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {renderContent()}

          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="flex-1 bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {isCompleting ? 'Completing...' : 'Complete Exercise'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
