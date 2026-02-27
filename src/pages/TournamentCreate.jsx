import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Users, Calendar } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const TournamentCreate = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        game: '',
        minRank: '',
        maxPlayers: '',
        startDate: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await apiRequest('/api/tournaments', {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    actor: user?.username || 'staff',
                    actorRole: user?.role || 'employee',
                }),
            });
            navigate('/employee');
        } catch (err) {
            setError(err.message || 'Failed to create tournament');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={18} className="mr-1" /> Back
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-100">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <Trophy size={24} className="text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Create New Tournament</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tournament Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Winter Valorant Championship"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Game Title</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                            value={formData.game}
                            onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                            required
                        >
                            <option value="">Select a game</option>
                            <option value="Valorant">Valorant</option>
                            <option value="CS:GO">CS:GO</option>
                            <option value="Apex Legends">Apex Legends</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Eligibility (Min Rank)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Platinum"
                            value={formData.minRank}
                            onChange={(e) => setFormData({ ...formData, minRank: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Max Players</label>
                        <div className="relative">
                            <Users size={18} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="number"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="64"
                                value={formData.maxPlayers}
                                onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                        <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
                        >
                            {loading ? 'Creating...' : 'Create Tournament'}
                        </button>
                        {error && <p className="text-sm text-rose-500 mt-2">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};
export default TournamentCreate;
