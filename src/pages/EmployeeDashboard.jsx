import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Plus, Calendar, Trophy, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';

const EmployeeDashboard = () => {
    const [verifications, setVerifications] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [error, setError] = useState('');
    const [proofOpeningId, setProofOpeningId] = useState('');
    const [gamerFeed, setGamerFeed] = useState([]);
    const [feedKind, setFeedKind] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            const [{ verifications: verifyItems }, { tournaments: tournamentItems }, { activities }] = await Promise.all([
                apiRequest('/api/verifications'),
                apiRequest('/api/tournaments'),
                apiRequest('/api/feed/employee?kind=all'),
            ]);
            setVerifications(verifyItems);
            setTournaments(tournamentItems);
            setGamerFeed(activities || []);
        };

        fetchData().catch(() => {
            setVerifications([]);
            setTournaments([]);
            setGamerFeed([]);
        });
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchFeed = async () => {
            const { activities } = await apiRequest(`/api/feed/employee?kind=${feedKind}`);
            if (isMounted) setGamerFeed(activities || []);
        };

        void fetchFeed().catch(() => {
            if (isMounted) setGamerFeed([]);
        });

        const intervalId = setInterval(() => {
            void fetchFeed().catch(() => undefined);
        }, 10000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [feedKind]);

    const handleVerify = async (id, result) => {
        const approved = result === 'Approved';
        await apiRequest(`/api/verifications/achievements/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ approved, points: approved ? 100 : 0 }),
        });
        setVerifications(verifications.filter((v) => v.id !== id));
    };

    const handleOpenProof = async (id) => {
        try {
            setError('');
            setProofOpeningId(id);
            const { proofDataUrl } = await apiRequest(`/api/verifications/achievements/${id}/proof`);
            window.open(proofDataUrl, '_blank', 'noopener,noreferrer');
        } catch (err) {
            setError(err.message || 'Failed to open proof');
        } finally {
            setProofOpeningId('');
        }
    };

    const formatFeedTime = (iso) => {
        if (!iso) return '--:--:--';
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Operator Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage verifications and tournaments.</p>
                </div>
                <Link to="/create-tournament" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all font-medium">
                    <Plus size={18} />
                    Create Tournament
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CheckCircle size={20} className="text-slate-500" />
                            Pending Verifications
                        </h2>
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">{verifications.length}</span>
                    </div>
                    {error && <p className="px-6 py-3 text-sm text-rose-600 border-b border-rose-100 bg-rose-50">{error}</p>}
                    <div className="p-6 space-y-4">
                        {verifications.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">No pending verifications.</p>
                        ) : (
                            verifications.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{item.user}</h3>
                                        <p className="text-sm text-slate-500">{item.game} - {item.proof}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => void handleOpenProof(item.id)}
                                            disabled={!item.hasProof || proofOpeningId === item.id}
                                            className="px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:text-slate-400 disabled:hover:bg-transparent"
                                        >
                                            {proofOpeningId === item.id ? 'Opening...' : 'View Proof'}
                                        </button>
                                        <button
                                            onClick={() => void handleVerify(item.id, 'Approved')}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                            title="Approve"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => void handleVerify(item.id, 'Rejected')}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Reject"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Trophy size={20} className="text-slate-500" />
                            Active Tournaments
                        </h2>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {tournaments.map((t) => (
                            <div key={t.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-800">{t.name}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Trophy size={14} /> {t.game}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(t.startDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                                    {t.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Activity size={20} className="text-slate-500" />
                        Gamer Live Feed
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFeedKind('all')}
                            className={`text-xs px-2.5 py-1 rounded-md border ${feedKind === 'all' ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-500'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFeedKind('proofs')}
                            className={`text-xs px-2.5 py-1 rounded-md border ${feedKind === 'proofs' ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-500'}`}
                        >
                            Proof Uploads
                        </button>
                        <button
                            onClick={() => setFeedKind('logins')}
                            className={`text-xs px-2.5 py-1 rounded-md border ${feedKind === 'logins' ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-slate-200 text-slate-500'}`}
                        >
                            User Logins
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-3 font-mono text-xs max-h-72 overflow-y-auto">
                    {gamerFeed.length === 0 && (
                        <p className="text-slate-500 font-sans text-sm">No gamer feed events yet.</p>
                    )}
                    {gamerFeed.map((entry) => (
                        <div key={entry.id} className="flex gap-3 text-slate-600">
                            <span className="text-slate-400">[{formatFeedTime(entry.createdAt)}]</span>
                            <span>{entry.message}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
