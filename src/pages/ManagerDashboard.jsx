import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Gamepad2, Activity, Search, Server, Shield, Database } from 'lucide-react';
import { apiRequest } from '../lib/api';

const ManagerDashboard = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [roleDrafts, setRoleDrafts] = useState({});
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');

    const [stats, setStats] = useState([
        { label: 'Total Users', value: '0', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Active Games', value: '0', icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'System Load', value: '0%', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Security Alerts', value: '0', icon: Shield, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    ]);

    const [users, setUsers] = useState([]);
    const [managerFeed, setManagerFeed] = useState([]);
    const [feedKind, setFeedKind] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            const [{ users: userItems }, { stats: systemStats }, { activities }] = await Promise.all([
                apiRequest('/api/users'),
                apiRequest('/api/stats/system'),
                apiRequest('/api/feed/manager?kind=all'),
            ]);
            setUsers(userItems);
            setManagerFeed(activities || []);
            const nextDrafts = {};
            userItems.forEach((entry) => {
                nextDrafts[entry.id] = String(entry.role).toLowerCase();
            });
            setRoleDrafts(nextDrafts);
            setStats([
                { label: 'Total Users', value: String(systemStats.totalUsers), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Active Games', value: String(systemStats.activeGames), icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { label: 'System Load', value: systemStats.systemLoad, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Security Alerts', value: String(systemStats.securityAlerts), icon: Shield, color: 'text-rose-400', bg: 'bg-rose-500/10' },
            ]);
        };
        fetchData().catch(() => {
            setUsers([]);
        });
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchFeed = async () => {
            const { activities } = await apiRequest(`/api/feed/manager?kind=${feedKind}`);
            if (isMounted) setManagerFeed(activities || []);
        };

        void fetchFeed().catch(() => {
            if (isMounted) setManagerFeed([]);
        });

        const intervalId = setInterval(() => {
            void fetchFeed().catch(() => undefined);
        }, 10000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [feedKind]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return users;
        return users.filter((entry) => entry.name.toLowerCase().includes(query));
    }, [users, search]);

    const toggleStatus = async (id) => {
        const current = users.find((entry) => entry.id === id);
        if (!current) return;
        const nextStatus = current.status === 'Active' ? 'Banned' : 'Active';

        await apiRequest(`/api/users/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: nextStatus, actor: user?.username, actorRole: user?.role }),
        });

        setUsers(users.map(u => (u.id === id ? { ...u, status: nextStatus } : u)));
    };

    const applyRoleChange = async (id) => {
        const selectedRole = roleDrafts[id];
        if (!selectedRole) return;
        setActionError('');
        setActionSuccess('');

        const isSelf = user?.id === id;
        if (isSelf && selectedRole !== 'manager') {
            setActionError('You cannot demote your own admin role.');
            return;
        }

        try {
            await apiRequest(`/api/users/${id}/role`, {
                method: 'PATCH',
                body: JSON.stringify({ role: selectedRole, actor: user?.username, actorRole: user?.role }),
            });

            const normalizedLabel = selectedRole[0].toUpperCase() + selectedRole.slice(1);
            setUsers(users.map((entry) => (
                entry.id === id ? { ...entry, role: normalizedLabel } : entry
            )));
            setActionSuccess('Role updated successfully.');
        } catch (err) {
            setActionError(err.message || 'Failed to update role. Restart backend and try again.');
        }
    };

    const formatFeedTime = (iso) => {
        if (!iso) return '--:--:--';
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none text-xs font-mono w-48 text-slate-300 placeholder-slate-600"
                            />
                        </div>
                    </div>
                    {actionError && (
                        <div className="px-6 py-3 text-sm text-rose-300 border-b border-rose-500/20 bg-rose-500/10">
                            {actionError}
                        </div>
                    )}
                    {actionSuccess && (
                        <div className="px-6 py-3 text-sm text-emerald-300 border-b border-emerald-500/20 bg-emerald-500/10">
                            {actionSuccess}
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Identity</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Access Level</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Last Active</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono text-right">Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-slate-200">{u.name}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            <select
                                                value={roleDrafts[u.id] || String(u.role).toLowerCase()}
                                                onChange={(e) => setRoleDrafts({ ...roleDrafts, [u.id]: e.target.value })}
                                                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
                                            >
                                                <option value="user">USER</option>
                                                <option value="employee">EMPLOYEE</option>
                                                <option value="manager">MANAGER</option>
                                            </select>
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
                                                onClick={() => void applyRoleChange(u.id)}
                                                className="text-xs font-bold px-3 py-1.5 rounded text-emerald-300 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 mr-2"
                                            >
                                                APPLY ROLE
                                            </button>
                                            <button
                                                onClick={() => void toggleStatus(u.id)}
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
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Activity size={16} /> Live Feed
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFeedKind('all')}
                                className={`text-[10px] px-2 py-1 rounded border ${feedKind === 'all' ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-400 border-slate-700'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFeedKind('security')}
                                className={`text-[10px] px-2 py-1 rounded border ${feedKind === 'security' ? 'text-rose-300 border-rose-500/30 bg-rose-500/10' : 'text-slate-400 border-slate-700'}`}
                            >
                                Security
                            </button>
                            <button
                                onClick={() => setFeedKind('staff')}
                                className={`text-[10px] px-2 py-1 rounded border ${feedKind === 'staff' ? 'text-blue-300 border-blue-500/30 bg-blue-500/10' : 'text-slate-400 border-slate-700'}`}
                            >
                                Staff
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4 font-mono text-xs">
                        {managerFeed.length === 0 && (
                            <div className="text-slate-500">No feed events yet.</div>
                        )}
                        {managerFeed.map((entry) => (
                            <div
                                key={entry.id}
                                className={`flex gap-3 ${entry.severity === 'warn' ? 'text-rose-400' : entry.scope === 'staff_management' ? 'text-emerald-400' : 'text-slate-300'}`}
                            >
                                <span className="text-slate-600">[{formatFeedTime(entry.createdAt)}]</span>
                                <span>{entry.message}</span>
                            </div>
                        ))}
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
