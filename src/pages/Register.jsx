import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Gamepad2, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        // Simulate registration by logging in immediately
        login('user', formData.username);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 shadow-2xl z-10">
                <div className="text-center mb-8">
                    <Link to="/login" className="flex justify-center mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                            <Gamepad2 size={40} className="text-white" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Join GameCloud
                    </h1>
                    <p className="text-slate-400 mt-2">Start your legacy today</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Create Account <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 cursor-pointer">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
