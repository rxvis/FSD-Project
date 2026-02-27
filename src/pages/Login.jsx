import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2 } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const loggedInUser = await login({ username, password });

            if (loggedInUser.role === 'manager') navigate('/manager');
            else if (loggedInUser.role === 'employee') navigate('/employee');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white relative overflow-hidden font-sans">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent"></div>
            </div>

            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md p-8 rounded-xl border border-slate-800 shadow-2xl z-10 relative">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                            <Gamepad2 size={40} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">
                        GameCloud
                    </h1>
                    <p className="text-slate-400 text-sm font-medium tracking-wide mt-2">Professional Esports Platform</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                required
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-white placeholder-slate-600 transition-all font-medium"
                                placeholder="Gamertag / ID"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-white placeholder-slate-600 transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wide rounded-lg shadow-lg transform transition-all hover:-translate-y-0.5 hover:shadow-blue-600/25 active:scale-95 active:translate-y-0"
                    >
                        {loading ? 'Signing In...' : 'Login to System'}
                    </button>
                    {error && <p className="text-sm text-rose-400 text-center">{error}</p>}
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                    <p>Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-400 cursor-pointer font-bold">REGISTER HERE</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
