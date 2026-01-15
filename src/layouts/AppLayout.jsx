import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Trophy, Shield } from 'lucide-react';

const AppLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Enable dark/professional theme for both Manager and User (Gamer) roles
    const isProTheme = user?.role === 'manager' || user?.role === 'user';
    const isManager = user?.role === 'manager';

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isProTheme ? 'bg-[#0a0a0c] text-white' : 'bg-slate-50'}`}>
            {/* Navbar */}
            <header className={`sticky top-0 z-30 shadow-sm border-b transition-colors duration-300 ${isProTheme ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 cursor-pointer">
                            <div className={`p-1.5 rounded-lg ${isManager ? 'bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.4)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]'}`}>
                                <Trophy size={20} className="text-white" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight mr-4 ${isProTheme ? 'text-white' : 'text-slate-800'}`}>GameCloud</span>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Link to="/leaderboard" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isProTheme ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>Leaderboard</Link>
                            <Link to="/tournaments" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isProTheme ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>Tournaments</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-full border transition-colors ${isProTheme ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                            <span className={`text-sm font-medium capitalize px-2 ${isManager ? 'text-emerald-400' : 'text-blue-400'}`}>{user?.role}</span>
                            <span className={`w-1 h-4 ${isProTheme ? 'bg-slate-600' : 'bg-slate-300'}`}></span>
                            <span className={`text-sm font-bold ${isProTheme ? 'text-white' : 'text-slate-800'}`}>{user?.username}</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className={`p-2 rounded-lg transition-colors ${isProTheme ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'}`}
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
