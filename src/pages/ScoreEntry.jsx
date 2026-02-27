import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

const ScoreEntry = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({ game: '', score: '', date: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            setError('');
            setLoading(true);
            await apiRequest('/api/scores', {
                method: 'POST',
                body: JSON.stringify({
                    userId: user.id,
                    ...formData,
                }),
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to save score');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={18} className="mr-1" /> Back
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4 border-slate-100">Add New Score</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Game Title</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-black"
                            value={formData.game}
                            onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                            required
                        >
                            <option value="">Select a game</option>
                            <option value="Valorant">Valorant</option>
                            <option value="CS:GO">CS:GO</option>
                            <option value="Apex Legends">Apex Legends</option>
                            <option value="League of Legends">League of Legends</option>
                            <option value="Overwatch 2">Overwatch 2</option>
                            <option value="Fortnite">Fortnite</option>
                            <option value="Call of Duty">Call of Duty</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Score / Rank Achieved</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 240 or Platinum III"
                            value={formData.score}
                            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date Achieved</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Score'}
                        </button>
                        {error && <p className="text-sm text-rose-500 mt-2">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ScoreEntry;
