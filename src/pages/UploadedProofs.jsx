import { useEffect, useMemo, useState } from 'react';
import { FileCheck, Clock3, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

const statusClasses = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Verified: 'bg-green-100 text-green-700',
    Rejected: 'bg-rose-100 text-rose-700',
};

const UploadedProofs = () => {
    const { user } = useAuth();
    const [proofs, setProofs] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProofs = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setError('');
                const { achievements } = await apiRequest(`/api/achievements?userId=${user.id}`);
                setProofs(achievements);
            } catch (err) {
                setError(err.message || 'Failed to load uploaded proofs');
            } finally {
                setLoading(false);
            }
        };

        fetchProofs();
    }, [user?.id]);

    const filteredProofs = useMemo(() => {
        if (activeFilter === 'All') return proofs;
        return proofs.filter((item) => (item.status || 'Pending') === activeFilter);
    }, [proofs, activeFilter]);

    const statusCounts = useMemo(() => ({
        All: proofs.length,
        Pending: proofs.filter((item) => (item.status || 'Pending') === 'Pending').length,
        Verified: proofs.filter((item) => (item.status || 'Pending') === 'Verified').length,
        Rejected: proofs.filter((item) => (item.status || 'Pending') === 'Rejected').length,
    }), [proofs]);

    const filters = ['All', 'Pending', 'Verified', 'Rejected'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Proof Submissions</h1>
                    <p className="text-slate-600 mt-1">Track verification status for each proof submission</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    <Filter size={16} className="text-slate-500 ml-2" />
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                activeFilter === filter
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {filter} ({statusCounts[filter]})
                        </button>
                    ))}
                </div>
            </div>

            {loading && <p className="text-slate-600">Loading uploaded proofs...</p>}
            {error && <p className="text-rose-600">{error}</p>}

            {!loading && !error && filteredProofs.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                    <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-slate-900">No proofs found</h3>
                    <p className="text-slate-500 mt-1">Upload a proof to start the verification process.</p>
                </div>
            )}

            {!loading && !error && filteredProofs.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr className="text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-6 py-4">Proof</th>
                                    <th className="px-6 py-4">Submitted</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProofs.map((item) => {
                                    const status = item.status || 'Pending';
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-900">{item.proofFileName || item.title}</p>
                                                <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {new Date(item.date).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>
                                                    {status === 'Pending' && <Clock3 size={14} />}
                                                    {status === 'Verified' && <CheckCircle2 size={14} />}
                                                    {status === 'Rejected' && <XCircle size={14} />}
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                                {item.points || 0}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadedProofs;
