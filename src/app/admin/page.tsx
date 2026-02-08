"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Trash2, ArrowLeft, ShieldAlert, Zap, BarChart3, Clock, Settings, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ totalGenerations: 0, mostUsed: "-" });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const storedActivities = JSON.parse(localStorage.getItem('mock_activity') || '[]');

        setUsers(storedUsers);
        setActivities(storedActivities);

        // Calculate Stats
        const counts = storedActivities.reduce((acc: any, curr: any) => {
            acc[curr.tool] = (acc[curr.tool] || 0) + 1;
            return acc;
        }, {});

        let mostUsed = "-";
        let max = 0;
        Object.entries(counts).forEach(([tool, count]: [any, any]) => {
            if (count > max) {
                max = count;
                mostUsed = tool;
            }
        });

        setStats({
            totalGenerations: storedActivities.length,
            mostUsed: mostUsed
        });

        setIsLoading(false);
    }, [router]);

    const handleDeleteUser = (email: string) => {
        if (confirm(`Are you sure you want to delete user ${email}?`)) {
            const updatedUsers = users.filter(u => u.email !== email);
            localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);

            const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
            if (currentUser.email === email) {
                localStorage.removeItem('current_user');
                router.push('/');
            }
        }
    };

    if (isLoading) return null;

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Tools</span>
                        </button>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                            Admin Console
                        </h1>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-gray-400">Total Users</span>
                        </div>
                        <p className="text-4xl font-bold">{users.length}</p>
                    </div>
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Zap className="w-6 h-6" />
                            </div>
                            <span className="text-gray-400">Total Generations</span>
                        </div>
                        <p className="text-4xl font-bold">{stats.totalGenerations}</p>
                    </div>
                    <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <span className="text-gray-400">Most Popular Tool</span>
                        </div>
                        <p className="text-4xl font-bold">{stats.mostUsed}</p>
                    </div>
                </div>

                {/* Platform Configuration */}
                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Settings className="w-6 h-6 text-purple-400" />
                        Platform Settings
                    </h2>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="flex flex-col gap-4">
                            <label className="text-sm text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                                <Key className="w-4 h-4" />
                                Google Gemini API Key
                            </label>
                            <div className="flex gap-4">
                                <input
                                    type="password"
                                    placeholder="Enter new API Key (sk-...)"
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none transition-colors"
                                    id="apiKeyInput"
                                />
                                <button
                                    onClick={async () => {
                                        const input = document.getElementById('apiKeyInput') as HTMLInputElement;
                                        const key = input.value;
                                        if (!key) return alert("Please enter a key");

                                        try {
                                            const res = await fetch('/api/settings', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ apiKey: key })
                                            });
                                            if (res.ok) {
                                                alert("API Key Saved Successfully! The platform is now using this key.");
                                                input.value = "";
                                            } else {
                                                alert("Failed to save key.");
                                            }
                                        } catch (e) {
                                            alert("Error saving key.");
                                        }
                                    }}
                                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
                                >
                                    Save Configuration
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">
                                This key will be used for all AI generation tools (Video, Image, Voice).
                                It overrides the environment variable.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User List */}
                    <div className="glass-panel rounded-3xl border border-white/10 bg-white/5 overflow-hidden h-fit">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                Users ({users.length})
                            </h2>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user, i) => {
                                        const userGens = activities.filter(a => a.email === user.email).length;
                                        return (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs uppercase">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{user.name}</div>
                                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{user.role}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{user.email}</td>
                                                <td className="py-4 px-4 text-sm font-bold text-blue-400">{userGens}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.email)}
                                                        className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Global Activity */}
                    <div className="glass-panel rounded-3xl border border-white/10 bg-white/5 overflow-hidden h-fit">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-400" />
                                Global Activity
                            </h2>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
                            {activities.length > 0 ? (
                                activities.map((act, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${act.tool === 'Video' ? 'bg-purple-500/20 text-purple-300' :
                                                act.tool === 'Image' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                                                }`}>
                                                {act.tool}
                                            </span>
                                            <span className="text-[10px] text-gray-500">{new Date(act.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm font-medium text-white mb-1">{act.details}</p>
                                        <p className="text-xs text-gray-500">by {act.name} ({act.email})</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500 italic">No activity recorded yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
