import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Plus, Calendar, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
    const { user } = useAuth();

    // Mock Verification Data
    const [verifications, setVerifications] = useState([
        { id: 1, user: 'GamerOne', game: 'Valorant', proof: 'screenshot.png', status: 'Pending' },
        { id: 2, user: 'ProPlayerX', game: 'Apex Legends', proof: 'cert.pdf', status: 'Pending' },
    ]);

    // Mock Tournaments
    const tournaments = [
        { id: 1, name: 'Winter Championship', game: 'Valorant', date: '2023-12-01', status: 'Open' },
        { id: 2, name: 'Community Cup', game: 'CS:GO', date: '2023-11-20', status: 'Draft' },
    ];

    const handleVerify = (id, result) => {
        setVerifications(verifications.filter(v => v.id !== id));
        console.log(`Verification ${id} marked as ${result}`);
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
                {/* Verification Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CheckCircle size={20} className="text-slate-500" />
                            Pending Verifications
                        </h2>
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">{verifications.length}</span>
                    </div>
                    <div className="p-6 space-y-4">
                        {verifications.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">No pending verifications.</p>
                        ) : (
                            verifications.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{item.user}</h3>
                                        <p className="text-sm text-slate-500">{item.game} • {item.proof}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleVerify(item.id, 'Approved')}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleVerify(item.id, 'Rejected')}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Tournaments Section */}
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
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {t.date}</span>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                    {t.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EmployeeDashboard;
