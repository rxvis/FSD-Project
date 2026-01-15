import { Calendar, Trophy, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tournaments = () => {
    const tournaments = [
        { id: 1, title: 'Winter Valorant Championship', game: 'Valorant', prize: '$5,000', date: 'Dec 15, 2023', region: 'NA', registered: 42, max: 64 },
        { id: 2, title: 'Apex Legends Pro League', game: 'Apex Legends', prize: '$10,000', date: 'Nov 20, 2023', region: 'Global', registered: 18, max: 20 },
        { id: 3, title: 'CS:GO Community Cup', game: 'CS:GO', prize: '$500', date: 'Oct 30, 2023', region: 'EU', registered: 120, max: 128 },
    ];

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
                                    {t.title}
                                </h3>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-sm text-slate-500 gap-2">
                                    <Calendar size={16} className="text-blue-500" />
                                    {t.date}
                                </div>
                                <div className="flex items-center text-sm text-slate-500 gap-2">
                                    <Trophy size={16} className="text-yellow-500" />
                                    Prize Pool: <span className="font-semibold text-slate-700">{t.prize}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-500 gap-2">
                                    <Users size={16} className="text-purple-500" />
                                    {t.registered}/{t.max} Players
                                </div>
                            </div>

                            <button
                                onClick={() => alert(`Registered for ${t.title}!`)}
                                className="w-full py-2.5 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/25 active:scale-95">
                                Register Now <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tournaments;
