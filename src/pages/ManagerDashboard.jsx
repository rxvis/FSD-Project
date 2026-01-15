import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Gamepad2, AlertTriangle, Activity, Search, Server, Shield, Database } from 'lucide-react';

const ManagerDashboard = () => {
    const { user } = useAuth();

    // Mock System Stats
    const stats = [
        { label: 'Total Users', value: '1,234', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Active Games', value: '12', icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'System Load', value: '42%', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Security Alerts', value: '0', icon: Shield, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    ];

    // Mock User List
    const [users, setUsers] = useState([
        { id: 1, name: 'GamerOne', role: 'User', status: 'Active', login: '2 mins ago' },
        { id: 2, name: 'EmployeeJohn', role: 'Employee', status: 'Active', login: '1 hour ago' },
        { id: 3, name: 'BannedUser99', role: 'User', status: 'Banned', login: '30 days ago' },
        { id: 4, name: 'ProSlayer', role: 'User', status: 'Active', login: 'Just now' },
        { id: 5, name: 'TournamentAdmin', role: 'Employee', status: 'Active', login: '5 hours ago' },
    ]);

    const toggleStatus = (id) => {
        setUsers(users.map(u => {
            if (u.id === id) {
                return { ...u, status: u.status === 'Active' ? 'Banned' : 'Active' };
            }
            return u;
        }));
    };

    return (
        <div className="space-y-8 text-white font-sans">
            <div className="flex justify-between items-end border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        <Server className="text-emerald-500" />
                        SYSTEM COMMAND
                    </h1>
                    <p className="text-slate-400 mt-2 font-mono text-sm">ROOT ACCESS GRANTED // WELCOME COMMANDER {user?.username.toUpperCase()}</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-xs font-mono text-emerald-400 flex items-center gap-2 shadow-lg shadow-emerald-900/10">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        SYSTEM OPERATIONAL
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-all group animate-fade-in">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                            <Activity size={16} className="text-slate-600 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Database */}
                <div className="lg:col-span-2 bg-slate-900/80 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Database size={20} className="text-emerald-500" />
                            USER DATABASE
                        </h2>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="SEARCH QUERY..."
                                className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-xs font-mono w-48 text-slate-300 placeholder-slate-600"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Identity</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Access Level</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Last Active</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono text-right">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-slate-200">{u.name}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${u.role === 'Manager' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    u.role === 'Employee' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-mono">{u.login}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${u.status === 'Active' ? 'text-emerald-400 bg-emerald-500/5' : 'text-rose-400 bg-rose-500/5'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => toggleStatus(u.id)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${u.status === 'Active'
                                                        ? 'text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30'
                                                        : 'text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30'
                                                    }`}
                                            >
                                                {u.status === 'Active' ? 'REVOKE ACCESS' : 'RESTORE ACCESS'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Logs */}
                <div className="bg-slate-900/80 rounded-xl border border-slate-800 shadow-2xl p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity size={16} /> Live Feed
                    </h3>
                    <div className="space-y-4 font-mono text-xs">
                        <div className="flex gap-3 text-slate-300">
                            <span className="text-slate-600">[22:45:01]</span>
                            <span>System backup completed successfully.</span>
                        </div>
                        <div className="flex gap-3 text-emerald-400">
                            <span className="text-slate-600">[22:42:15]</span>
                            <span>User "ProSlayer" uploaded new achievement proof.</span>
                        </div>
                        <div className="flex gap-3 text-slate-300">
                            <span className="text-slate-600">[22:40:00]</span>
                            <span>Tournament "Winter Cup" registration opened.</span>
                        </div>
                        <div className="flex gap-3 text-rose-400">
                            <span className="text-slate-600">[22:15:22]</span>
                            <span>Failed login attempt detected from IP 192.168.1.X.</span>
                        </div>
                        <div className="flex gap-3 text-blue-400">
                            <span className="text-slate-600">[22:10:05]</span>
                            <span>New generic leaderboard calculation finished.</span>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-800">
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[42%] animate-pulse"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                            <span>SERVER LOAD</span>
                            <span>42% OPTIMAL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ManagerDashboard;
