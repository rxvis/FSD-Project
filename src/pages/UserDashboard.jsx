import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Upload, PlusCircle, Star, Activity, Medal, Crosshair, Users, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';

const UserDashboard = () => {
    const { user } = useAuth();
    const [timeRange, setTimeRange] = useState('All Time');
    const [recentScores, setRecentScores] = useState([]);

    useEffect(() => {
        const fetchScores = async () => {
            if (!user?.id) return;
            const { scores } = await apiRequest(`/api/scores?userId=${user.id}`);
            setRecentScores(scores.slice(0, 5));
        };

        fetchScores().catch(() => {
            setRecentScores([]);
        });
    }, [user?.id]);

    const stats = useMemo(() => ([
        { label: 'Skill Rating', value: '2,450', sub: 'Top 5%', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        { label: 'Tournaments Won', value: '8', sub: '12 Played', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { label: 'Global Rank', value: '#42', sub: '+3 this week', icon: Medal, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { label: 'K/D Ratio', value: '1.85', sub: 'Avg 24 Kills', icon: Crosshair, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    ]), []);

    const upcomingEvents = [
        { title: 'Winter Championship', game: 'Valorant', date: 'Tomorrow, 18:00', type: 'Finals' },
        { title: 'Weekly Scrim', game: 'CS:GO', date: 'Fri, 20:00', type: 'Practice' },
    ];

    return (
        <div className="space-y-8 font-sans">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase flex items-center gap-3">
                        <Activity className="text-blue-500" />
                        Gamer Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Welcome back, <span className="text-blue-400 font-bold">{user?.username}</span>. Ready to dominate?</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/score-entry" className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-lg font-bold uppercase text-xs tracking-wide group">
                        <PlusCircle size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                        Add Score
                    </Link>
                    <Link to="/upload-achievement" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] font-bold uppercase text-xs tracking-wide">
                        <Upload size={16} />
                        Upload Proof
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className={`relative overflow-hidden bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border ${stat.border} hover:border-opacity-50 transition-all group animate-slide-up`} style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={64} className={stat.color} />
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon size={20} className={stat.color} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                            <p className={`text-xs font-bold mt-1 ${stat.color} opacity-80`}>{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Performance & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Performance Graph Placeholder */}
                    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-emerald-500" />
                                Performance Analysis
                            </h2>
                            <div className="flex bg-slate-950 p-1 rounded-lg">
                                {['Week', 'Month', 'All Time'].map(range => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${timeRange === range ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Mock Graph Visual */}
                        <div className="h-64 w-full bg-gradient-to-t from-blue-500/5 to-transparent rounded-lg relative flex items-end justify-between px-4 pb-0 border-b border-slate-800">
                            {[30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95].map((h, i) => (
                                <div key={i} className="w-full mx-1 bg-blue-500/20 hover:bg-blue-500/40 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">
                                        Score: {h * 10}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs font-mono text-slate-500">
                            <span>WEEK 1</span>
                            <span>WEEK 2</span>
                            <span>WEEK 3</span>
                            <span>CURRENT</span>
                        </div>
                    </div>

                    {/* Recent Matches */}
                    <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity size={20} className="text-blue-500" />
                                Match History
                            </h2>
                            <Link to="/tournaments" className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wide">View Full History</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Game</th>
                                        <th className="px-6 py-4">Mode</th>
                                        <th className="px-6 py-4">Performance</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50 text-sm">
                                    {recentScores.map((score, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-white">{score.game}</td>
                                            <td className="px-6 py-4 text-slate-400">{score.mode || 'Ranked'}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-mono">{score.score}</td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(score.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${score.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    }`}>
                                                    {score.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Events & Social */}
                <div className="space-y-6">
                    {/* Next Tournament */}
                    <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-xl border border-blue-500/30 p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Trophy size={80} className="text-blue-400 rotate-12" />
                        </div>
                        <h3 className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">Up Next</h3>
                        <h2 className="text-xl font-black text-white mb-1">Winter Valorant Cup</h2>
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                            <Calendar size={14} />
                            <span>Starts in 2h 45m</span>
                        </div>
                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all uppercase tracking-wide">
                            Check In Now
                        </button>
                    </div>

                    {/* Upcoming List */}
                    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar size={18} className="text-purple-500" />
                            Upcoming Events
                        </h3>
                        <div className="space-y-4">
                            {upcomingEvents.map((event, i) => (
                                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-800 last:border-0 last:pb-0">
                                    <div className="bg-slate-800 p-2 rounded text-slate-400 text-center min-w-[3rem]">
                                        <span className="block text-xs font-bold uppercase">{event.date.split(',')[0]}</span>
                                        <span className="block text-xs">{event.date.split(' ')[1]}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{event.title}</h4>
                                        <p className="text-xs text-slate-500">{event.game} • {event.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Squad Status */}
                    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Users size={18} className="text-emerald-500" />
                            Squad Online (3)
                        </h3>
                        <div className="space-y-3">
                            {['Viper_XX', 'GhostRecon', 'JettMain'].map((friend, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                            {friend[0]}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-200">{friend}</h4>
                                        <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wide">In Lobby</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UserDashboard;
