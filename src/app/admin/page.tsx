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

        // Fetch users and activities from database
        const fetchData = async () => {
            try {
                // Fetch users
                const usersResponse = await fetch('/api/users');
                const usersData = await usersResponse.json();
                if (usersData.success) {
                    setUsers(usersData.users || []);
                }

                // Fetch activities
                const activityResponse = await fetch('/api/activity');
                const activityData = await activityResponse.json();
                if (activityData.success) {
                    setActivities(activityData.activities || []);

                    // Calculate Stats
                    const counts = activityData.activities.reduce((acc: any, curr: any) => {
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
                        totalGenerations: activityData.activities.length,
                        mostUsed: mostUsed
                    });
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleDeleteUser = async (email: string) => {
        if (confirm(`Are you sure you want to delete user ${email}?`)) {
            try {
                const response = await fetch('/api/users', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (data.success) {
                    // Refresh users list
                    const updatedUsers = users.filter(u => u.email !== email);
                    setUsers(updatedUsers);

                    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
                    if (currentUser.email === email) {
                        localStorage.removeItem('current_user');
                        router.push('/');
                    }
                } else {
                    alert('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    if (isLoading) return null;

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6">
                <div className="flex flex-col gap-4 mb-8 md:mb-12">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group self-start min-h-[44px] px-2 -ml-2 rounded-lg hover:bg-white/5"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm md:text-base">Back to Tools</span>
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="w-7 h-7 md:w-8 md:h-8 text-red-500" />
                                <span className="bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Admin Console</span>
                            </div>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base mt-2">Manage platform settings, users, and monitor activity</p>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="glass-panel p-5 md:p-6 rounded-2xl md:rounded-3xl border border-purple-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/10 hover:border-purple-500/40 transition-all">
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
                                <Users className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <span className="text-gray-300 text-sm md:text-base font-medium">Total Users</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">{users.length}</p>
                    </div>
                    <div className="glass-panel p-5 md:p-6 rounded-2xl md:rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/10 hover:border-purple-500/40 transition-all">
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20">
                                <Zap className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <span className="text-gray-300 text-sm md:text-base font-medium">Total Generations</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stats.totalGenerations}</p>
                    </div>
                    <div className="glass-panel p-5 md:p-6 rounded-2xl md:rounded-3xl border border-purple-500/20 bg-gradient-to-br from-yellow-900/20 to-orange-900/10 hover:border-purple-500/40 transition-all">
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-lg shadow-yellow-500/20">
                                <BarChart3 className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <span className="text-gray-300 text-sm md:text-base font-medium">Most Popular Tool</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent truncate">{stats.mostUsed}</p>
                    </div>
                </div>

                {/* Platform Configuration */}
                <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-blue-900/20 border border-purple-500/30 rounded-3xl p-6 md:p-8 mb-8 backdrop-blur-xl shadow-2xl">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                        <Settings className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                        Platform Settings
                    </h2>

                    <div className="bg-black/50 border border-purple-500/20 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                        <div className="flex flex-col gap-4">
                            <label className="text-xs md:text-sm text-gray-300 font-bold uppercase tracking-wider flex items-center gap-2">
                                <Key className="w-4 h-4 text-purple-400" />
                                Google Gemini API Key
                            </label>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <input
                                    type="password"
                                    placeholder="Enter new API Key (sk-...)"
                                    className="flex-1 bg-black/70 border border-purple-500/30 rounded-xl px-4 py-3 md:py-3.5 text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all text-sm md:text-base min-h-[44px]"
                                    id="apiKeyInput"
                                />
                                <div className="flex gap-2 sm:gap-3">
                                    <button
                                        onClick={async () => {
                                            const input = document.getElementById('apiKeyInput') as HTMLInputElement;
                                            const key = input.value;
                                            if (!key) return alert("⚠️ Please enter a key");

                                            try {
                                                const res = await fetch('/api/settings', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ apiKey: key })
                                                });
                                                if (res.ok) {
                                                    alert("✅ API Key Saved Successfully! The platform is now using this key.");
                                                    input.value = "";
                                                } else {
                                                    alert("❌ Failed to save key.");
                                                }
                                            } catch (e) {
                                                alert("❌ Error saving key.");
                                            }
                                        }}
                                        className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold px-4 md:px-6 py-3 md:py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 min-h-[44px] flex items-center justify-center text-sm md:text-base"
                                    >
                                        <span className="hidden sm:inline">Save Configuration</span>
                                        <span className="sm:hidden">Save</span>
                                    </button>

                                    <button
                                        onClick={async () => {
                                            try {
                                                const res = await fetch('/api/settings');
                                                const data = await res.json();

                                                if (data.maskedKey) {
                                                    // Try to copy the masked key representation
                                                    navigator.clipboard.writeText(data.maskedKey).then(() => {
                                                        const btn = document.getElementById('copyBtn');
                                                        if (btn) {
                                                            btn.innerHTML = '✓';
                                                            setTimeout(() => {
                                                                btn.innerHTML = '📋';
                                                            }, 2000);
                                                        }
                                                    }).catch(() => {
                                                        alert("⚠️ Unable to copy to clipboard");
                                                    });
                                                } else {
                                                    alert("⚠️ No API key configured yet");
                                                }
                                            } catch (e) {
                                                alert("❌ Error fetching key");
                                            }
                                        }}
                                        id="copyBtn"
                                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-4 md:px-5 py-3 md:py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 min-h-[44px] flex items-center justify-center text-lg"
                                        title="Copy masked API key"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs md:text-sm text-gray-400 bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                                💡 This key will be used for all AI generation tools (Video, Image, Voice).
                                It overrides the environment variable.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* User List */}
                    <div className="glass-panel rounded-2xl md:rounded-3xl border border-purple-500/20 bg-gradient-to-br from-white/5 to-purple-900/10 overflow-hidden h-fit">
                        <div className="p-4 md:p-6 border-b border-purple-500/20 flex items-center justify-between bg-black/30">
                            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                Users ({users.length})
                            </h2>
                        </div>
                        <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-purple-500/10">
                                    {users.map((user, i) => {
                                        const userGens = activities.filter(a => a.email === user.email).length;
                                        return (
                                            <tr key={i} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                                                <td className="py-3 md:py-4 px-3 md:px-4">
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center text-purple-300 font-bold text-xs md:text-sm uppercase border border-purple-500/30">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-xs md:text-sm font-medium text-white truncate">{user.name}</div>
                                                            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">{user.role}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-400 hidden sm:table-cell truncate max-w-[150px]">{user.email}</td>
                                                <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-bold text-blue-400">{userGens}</td>
                                                <td className="py-3 md:py-4 px-2 md:px-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.email)}
                                                        className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                    <div className="glass-panel rounded-2xl md:rounded-3xl border border-purple-500/20 bg-gradient-to-br from-white/5 to-blue-900/10 overflow-hidden h-fit">
                        <div className="p-4 md:p-6 border-b border-purple-500/20 bg-black/30">
                            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-400" />
                                Global Activity
                            </h2>
                        </div>
                        <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                            {activities.length > 0 ? (
                                activities.map((act, i) => (
                                    <div key={i} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/40 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${act.tool === 'Video' ? 'bg-purple-500/20 text-purple-300' :
                                                act.tool === 'Image' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                                                }`}>
                                                {act.tool}
                                            </span>
                                            <span className="text-[10px] md:text-xs text-gray-500">{new Date(act.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs md:text-sm font-medium text-white mb-1 line-clamp-2">{act.details}</p>
                                        <p className="text-[10px] md:text-xs text-gray-500 truncate">by {act.name} ({act.email})</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500 italic text-sm">No activity recorded yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
