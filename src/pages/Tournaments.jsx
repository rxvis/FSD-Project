import { useEffect, useState } from 'react';
import { Calendar, Trophy, Users, ArrowRight, Trash2, Pencil, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

const Tournaments = () => {
    const { user } = useAuth();
    const [tournaments, setTournaments] = useState([]);
    const [error, setError] = useState('');
    const [removingId, setRemovingId] = useState('');
    const [editingId, setEditingId] = useState('');
    const [savingEditId, setSavingEditId] = useState('');
    const [editForm, setEditForm] = useState({
        name: '',
        game: '',
        minRank: '',
        maxPlayers: '',
        startDate: '',
        status: 'Open',
    });
    const canManageTournaments = user?.role === 'employee' || user?.role === 'manager';
    const canRegisterTournament = user?.role === 'user';

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const { tournaments: items } = await apiRequest('/api/tournaments');
                setTournaments(items);
            } catch (err) {
                setError(err.message || 'Failed to load tournaments');
            }
        };
        fetchTournaments();
    }, []);

    const handleRegister = async (id, title) => {
        if (!user?.id) return;
        try {
            await apiRequest(`/api/tournaments/${id}/register`, {
                method: 'POST',
                body: JSON.stringify({ userId: user.id }),
            });
            alert(`Registered for ${title}`);
        } catch (err) {
            alert(err.message || 'Failed to register');
        }
    };

    const handleRemoveTournament = async (id, title) => {
        if (!canManageTournaments || !user?.role) return;
        const shouldRemove = window.confirm(`Remove "${title}" tournament?`);
        if (!shouldRemove) return;

        try {
            setError('');
            setRemovingId(id);
            await apiRequest(`/api/tournaments/${id}`, {
                method: 'DELETE',
                body: JSON.stringify({
                    actorRole: user.role,
                    actor: user.username,
                }),
            });
            setTournaments((current) => current.filter((entry) => entry.id !== id));
        } catch (err) {
            setError(err.message || 'Failed to remove tournament');
        } finally {
            setRemovingId('');
        }
    };

    const handleStartEdit = (tournament) => {
        setError('');
        setEditingId(tournament.id);
        setEditForm({
            name: tournament.name || '',
            game: tournament.game || '',
            minRank: tournament.minRank || '',
            maxPlayers: tournament.maxPlayers || '',
            startDate: tournament.startDate ? String(tournament.startDate).slice(0, 10) : '',
            status: tournament.status || 'Open',
        });
    };

    const handleCancelEdit = () => {
        setEditingId('');
        setSavingEditId('');
        setEditForm({
            name: '',
            game: '',
            minRank: '',
            maxPlayers: '',
            startDate: '',
            status: 'Open',
        });
    };

    const handleSaveEdit = async (id) => {
        if (!canManageTournaments || !user?.role) return;
        try {
            setError('');
            setSavingEditId(id);
            const { tournament: updatedTournament } = await apiRequest(`/api/tournaments/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    actorRole: user.role,
                    actor: user.username,
                    ...editForm,
                }),
            });
            setTournaments((current) => current.map((entry) => (
                entry.id === id ? { ...entry, ...updatedTournament } : entry
            )));
            handleCancelEdit();
        } catch (err) {
            setError(err.message || 'Failed to update tournament');
        } finally {
            setSavingEditId('');
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto py-8">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Discover Tournaments
                </h1>
                <p className="text-lg text-slate-600">
                    Join competitive events, prove your skills, and win prizes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {error && <p className="text-rose-600">{error}</p>}
                {tournaments.map((t) => (
                    <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <Trophy className="absolute bottom-4 right-4 text-white/20 transform rotate-12 group-hover:scale-110 transition-transform" size={80} />
                            <div className="absolute bottom-4 left-4 text-white">
                                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">{t.game}</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                    {t.name}
                                </h3>
                            </div>

                            {editingId === t.id ? (
                                <div className="space-y-3 mb-4">
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tournament name"
                                    />
                                    <input
                                        type="text"
                                        value={editForm.game}
                                        onChange={(e) => setEditForm({ ...editForm, game: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Game title"
                                    />
                                    <input
                                        type="text"
                                        value={editForm.minRank}
                                        onChange={(e) => setEditForm({ ...editForm, minRank: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Minimum rank"
                                    />
                                    <input
                                        type="number"
                                        value={editForm.maxPlayers}
                                        onChange={(e) => setEditForm({ ...editForm, maxPlayers: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Max players (0 = unlimited)"
                                    />
                                    <input
                                        type="date"
                                        value={editForm.startDate}
                                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => void handleSaveEdit(t.id)}
                                            disabled={savingEditId === t.id}
                                            className="py-2.5 rounded-xl border border-emerald-500 text-emerald-600 font-semibold hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <Save size={16} />
                                            {savingEditId === t.id ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-slate-500 gap-2">
                                            <Calendar size={16} className="text-blue-500" />
                                            {new Date(t.startDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500 gap-2">
                                            <Trophy size={16} className="text-yellow-500" />
                                            Min Rank: <span className="font-semibold text-slate-700">{t.minRank || 'Open'}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500 gap-2">
                                            <Users size={16} className="text-purple-500" />
                                            {t.registered}/{t.maxPlayers || 'Unlimited'} Players
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {canRegisterTournament && (
                                            <button
                                                onClick={() => handleRegister(t.id, t.name)}
                                                className="w-full py-2.5 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/25 active:scale-95"
                                            >
                                                Register Now <ArrowRight size={16} />
                                            </button>
                                        )}
                                        {canManageTournaments && (
                                            <>
                                                <button
                                                    onClick={() => handleStartEdit(t)}
                                                    className="w-full py-2.5 rounded-xl border border-amber-300 text-amber-700 font-semibold hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Pencil size={16} />
                                                    Edit Tournament
                                                </button>
                                                <button
                                                    onClick={() => void handleRemoveTournament(t.id, t.name)}
                                                    disabled={removingId === t.id}
                                                    className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-600 font-semibold hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 size={16} />
                                                    {removingId === t.id ? 'Removing...' : 'Remove Tournament'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tournaments;

