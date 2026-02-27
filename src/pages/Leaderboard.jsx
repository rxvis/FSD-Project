import { useEffect, useState } from 'react';
import { Medal, Trophy, Crown } from 'lucide-react';
import { apiRequest } from '../lib/api';

const Leaderboard = () => {
    const [activeGame, setActiveGame] = useState('Global');
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState('');

    const games = ['Global', 'Valorant', 'CS:GO', 'Apex Legends', 'League of Legends', 'Overwatch 2'];

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setError('');
                const { players: entries } = await apiRequest(`/api/leaderboard?game=${encodeURIComponent(activeGame)}`);
                setPlayers(entries);
            } catch (err) {
                setError(err.message || 'Failed to load leaderboard');
            }
        };
        fetchLeaderboard();
    }, [activeGame]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Leaderboard</h1>
                    <p className="text-slate-500 mt-1">Top players across the platform.</p>
                </div>

                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {games.map(game => (
                        <button
                            key={game}
                            onClick={() => setActiveGame(game)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeGame === game
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {game}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-500" />
                    <span className="font-semibold text-slate-700">Top 100 Players</span>
                </div>
                {error && <p className="p-4 text-rose-600">{error}</p>}

                <div className="divide-y divide-slate-100">
                    {players.map((player) => (
                        <div key={player.rank} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${player.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                        player.rank === 2 ? 'bg-slate-200 text-slate-700' :
                                            player.rank === 3 ? 'bg-orange-100 text-orange-800' :
                                                'bg-slate-50 text-slate-500'
                                    }`}>
                                    {player.rank <= 3 ? <Crown size={16} /> : player.rank}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{player.name}</h3>
                                    <p className="text-xs text-slate-500">{player.game}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="font-bold text-slate-900 block">{player.score}</span>
                                <span className={`text-xs font-medium ${player.change === 'up' ? 'text-green-500' :
                                        player.change === 'down' ? 'text-red-500' : 'text-slate-400'
                                    }`}>
                                    {player.change === 'up' ? '▲ Rank Up' : player.change === 'down' ? '▼ Rank Down' : '- No Change'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
