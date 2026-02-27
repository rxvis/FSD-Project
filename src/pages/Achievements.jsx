import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Upload, Star, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

const Achievements = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setError('');
                const { achievements: items } = await apiRequest(`/api/achievements?userId=${user.id}`);
                setAchievements(items);
            } catch (err) {
                setError(err.message || 'Failed to load achievements');
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [user?.id]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Achievements</h1>
                    <p className="text-slate-600 mt-1">Track your gaming accomplishments and milestones</p>
                </div>
                <button
                    onClick={() => navigate('/upload-achievement')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Upload size={18} />
                    Upload Achievement
                </button>
            </div>

            {loading && <p className="text-slate-600">Loading achievements...</p>}
            {error && <p className="text-rose-600">{error}</p>}

            {!loading && !error && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement) => (
                    (() => {
                        const displayStatus = achievement.status || (achievement.verified ? 'Verified' : 'Pending');
                        const isVerified = displayStatus === 'Verified';
                        const isRejected = displayStatus === 'Rejected';

                        return (
                    <div
                        key={achievement.id}
                        className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
                            isVerified
                                ? 'bg-green-50 border-green-200'
                                : isRejected
                                    ? 'bg-rose-50 border-rose-200'
                                    : 'bg-yellow-50 border-yellow-200'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${
                                isVerified ? 'bg-green-100' : isRejected ? 'bg-rose-100' : 'bg-yellow-100'
                            }`}>
                                {isVerified ? (
                                    <Trophy className="w-6 h-6 text-green-600" />
                                ) : isRejected ? (
                                    <Award className="w-6 h-6 text-rose-600" />
                                ) : (
                                    <Award className="w-6 h-6 text-yellow-600" />
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-slate-600">
                                    {achievement.points} pts
                                </span>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {achievement.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-3">
                            {achievement.description}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                                {new Date(achievement.date).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isVerified
                                    ? 'bg-green-100 text-green-700'
                                    : isRejected
                                        ? 'bg-rose-100 text-rose-700'
                                        : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {displayStatus}
                            </span>
                        </div>
                    </div>
                        );
                    })()
                ))}
            </div>
            )}

            {!loading && !error && achievements.length === 0 && (
                <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No achievements yet</h3>
                    <p className="text-slate-600 mb-4">Start playing and earning achievements!</p>
                    <button
                        onClick={() => navigate('/upload-achievement')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Upload Your First Achievement
                    </button>
                </div>
            )}
        </div>
    );
};

export default Achievements;
