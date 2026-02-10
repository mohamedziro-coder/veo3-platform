"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Trash2, ArrowLeft, ShieldAlert, Zap, BarChart3, Clock, Settings, Key, Gift, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ totalGenerations: 0, mostUsed: "-" });
    const [creditAmount, setCreditAmount] = useState(50);
    const [creditMessage, setCreditMessage] = useState("");

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

                // Fetch Settings to populate form
                const settingsRes = await fetch('/api/settings');
                const settings = await settingsRes.json();
                if (settings && !settings.error) {
                    const projectIdInput = document.getElementById('projectIdInput') as HTMLInputElement;
                    const locationInput = document.getElementById('locationInput') as HTMLInputElement;
                    const bucketNameInput = document.getElementById('bucketNameInput') as HTMLInputElement; // NEW

                    if (projectIdInput && settings.projectId) projectIdInput.value = settings.projectId;
                    if (locationInput && settings.location) locationInput.value = settings.location;
                    if (bucketNameInput && settings.bucketName) bucketNameInput.value = settings.bucketName;
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
        <main className="min-h-screen bg-gray-50 text-gray-900 pt-24 px-6 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6">
                <div className="flex flex-col gap-4 mb-8 md:mb-12">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group self-start min-h-[44px] px-2 -ml-2 rounded-lg hover:bg-gray-200/50"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm md:text-base">Back to Tools</span>
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="w-7 h-7 md:w-8 md:h-8 text-red-500" />
                                <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Admin Console</span>
                            </div>
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base mt-2">Manage platform settings, users, and monitor activity</p>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <Users className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <span className="text-gray-600 text-sm md:text-base font-medium">Total Users</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-bold text-gray-900">{users.length}</p>
                    </div>
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                                <Zap className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <span className="text-gray-600 text-sm md:text-base font-medium">Total Generations</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-bold text-gray-900">{stats.totalGenerations}</p>
                    </div>
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                                <BarChart3 className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <span className="text-gray-600 text-sm md:text-base font-medium">Most Popular Tool</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-bold text-gray-900 truncate">{stats.mostUsed}</p>
                    </div>
                </div>

                {/* Credit Management */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                        <Gift className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                        Credit Management
                    </h2>

                    {/* Give Credits to All */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-green-600" />
                            Give Credits to All Users
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="number"
                                value={creditAmount}
                                onChange={(e) => setCreditAmount(Number(e.target.value))}
                                className="flex-1 bg-white border border-green-300 rounded-xl px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:outline-none text-center font-bold text-lg min-h-[44px]"
                                min="1"
                            />
                            <button
                                onClick={async () => {
                                    try {
                                        setCreditMessage("Processing...");
                                        const res = await fetch('/api/admin/give-all-credits', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ amount: creditAmount })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            setCreditMessage(`✅ ${data.message}`);
                                            // Refresh users list
                                            const usersRes = await fetch('/api/users');
                                            const usersData = await usersRes.json();
                                            if (usersData.success) setUsers(usersData.users || []);
                                        } else {
                                            setCreditMessage(`❌ ${data.error || 'Failed'}`);
                                        }
                                    } catch (e) {
                                        setCreditMessage("❌ Error giving credits");
                                    }
                                    setTimeout(() => setCreditMessage(""), 3000);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-md hover:shadow-lg min-h-[44px] whitespace-nowrap"
                            >
                                🎁 Give to Everyone
                            </button>
                        </div>
                        {creditMessage && (
                            <p className="mt-3 text-sm font-medium text-gray-700">{creditMessage}</p>
                        )}
                    </div>

                    {/* User Credit Management Table */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                        <h3 className="font-bold text-lg mb-4">User Credits Overview</h3>
                        <div className="overflow-x-auto -mx-6 sm:mx-0">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Email</th>
                                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Name</th>
                                        <th className="text-center py-3 px-4 text-sm font-bold text-gray-600">Credits</th>
                                        <th className="text-center py-3 px-4 text-sm font-bold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                                            <td className="py-4 px-4 text-sm">{user.email}</td>
                                            <td className="py-4 px-4 text-sm">{user.name}</td>
                                            <td className="py-4 px-4 text-center font-bold text-lg">
                                                {user.role === 'admin' ? '∞' : user.credits}
                                            </td>
                                            <td className="py-4 px-4">
                                                {user.role !== 'admin' && (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={async () => {
                                                                const res = await fetch('/api/admin/add-credits', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ email: user.email, credits: 100 })
                                                                });
                                                                if (res.ok) {
                                                                    const usersRes = await fetch('/api/users');
                                                                    const usersData = await usersRes.json();
                                                                    if (usersData.success) setUsers(usersData.users || []);
                                                                }
                                                            }}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 min-h-[36px] flex items-center gap-1"
                                                        >
                                                            <Plus className="w-3 h-3" /> 100
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                const res = await fetch('/api/admin/add-credits', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ email: user.email, credits: 50 })
                                                                });
                                                                if (res.ok) {
                                                                    const usersRes = await fetch('/api/users');
                                                                    const usersData = await usersRes.json();
                                                                    if (usersData.success) setUsers(usersData.users || []);
                                                                }
                                                            }}
                                                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 min-h-[36px] flex items-center gap-1"
                                                        >
                                                            <Plus className="w-3 h-3" /> 50
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                const res = await fetch('/api/admin/add-credits', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ email: user.email, credits: -50 })
                                                                });
                                                                if (res.ok) {
                                                                    const usersRes = await fetch('/api/users');
                                                                    const usersData = await usersRes.json();
                                                                    if (usersData.success) setUsers(usersData.users || []);
                                                                }
                                                            }}
                                                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 min-h-[36px] flex items-center gap-1"
                                                        >
                                                            <Minus className="w-3 h-3" /> 50
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Platform Configuration */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                        <Settings className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                        Platform Settings
                    </h2>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-6">
                        <div className="flex flex-col gap-4">
                            <label className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                <Key className="w-4 h-4 text-purple-600" />
                                Vertex AI Configuration
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Google Cloud Project ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. my-genai-project-123"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all text-sm"
                                        id="projectIdInput"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Location (Region)</label>
                                    <input
                                        type="text"
                                        placeholder="us-central1"
                                        defaultValue="us-central1"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all text-sm"
                                        id="locationInput"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                        GCS Bucket Name (Required for Veo)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. veo3-videos-prod"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all text-sm"
                                        id="bucketNameInput"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        Create a bucket: <code>gsutil mb -p PROJECT_ID gs://YOUR_BUCKET_NAME</code>
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Service Account JSON (Optional if using ADC)</label>
                                    <textarea
                                        placeholder='Paste contents of service-account.json here...'
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 focus:outline-none transition-all text-sm min-h-[100px] font-mono text-xs"
                                        id="jsonInput"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    const projectId = (document.getElementById('projectIdInput') as HTMLInputElement).value;
                                    const location = (document.getElementById('locationInput') as HTMLInputElement).value;
                                    const bucketName = (document.getElementById('bucketNameInput') as HTMLInputElement).value;
                                    const serviceAccountJson = (document.getElementById('jsonInput') as HTMLTextAreaElement).value;

                                    if (!projectId) return alert("⚠️ Project ID is required");
                                    if (!bucketName) return alert("⚠️ GCS Bucket Name is required for Veo");

                                    try {
                                        const res = await fetch('/api/settings', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ projectId, location, bucketName, serviceAccountJson })
                                        });
                                        if (res.ok) {
                                            alert("✅ Vertex AI Configuration Saved!");
                                        } else {
                                            const errData = await res.json();
                                            alert(`❌ Failed to save config: ${errData.error || "Unknown error"}`);
                                        }
                                    } catch (e) {
                                        alert("❌ Error saving config.");
                                    }
                                }}
                                className="bg-primary hover:bg-primary/90 text-white font-bold px-4 md:px-6 py-3 md:py-3.5 rounded-xl transition-all active:scale-95 shadow-md hover:shadow-lg min-h-[44px] flex items-center justify-center text-sm md:text-base mt-2"
                            >
                                Save Configuration
                            </button>

                            <p className="text-xs md:text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
                                💡 This configuration enables Veo 3.1, Imagen 3, and Gemini 1.5 Pro via Vertex AI.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* User List */}
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 overflow-hidden h-fit shadow-sm">
                        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-gray-900">
                                <Users className="w-5 h-5 text-blue-500" />
                                Users ({users.length})
                            </h2>
                        </div>
                        <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user, i) => {
                                        const userGens = activities.filter(a => a.email === user.email).length;
                                        return (
                                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 md:py-4 px-3 md:px-4">
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs md:text-sm uppercase border border-blue-200">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{user.name}</div>
                                                            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">{user.role}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-500 hidden sm:table-cell truncate max-w-[150px]">{user.email}</td>
                                                <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-bold text-blue-600">{userGens}</td>
                                                <td className="py-3 md:py-4 px-2 md:px-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.email)}
                                                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 overflow-hidden h-fit shadow-sm">
                        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-gray-900">
                                <Clock className="w-5 h-5 text-purple-600" />
                                Global Activity
                            </h2>
                        </div>
                        <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                            {activities.length > 0 ? (
                                activities.map((act, i) => (
                                    <div key={i} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${act.tool === 'Video' ? 'bg-purple-100 text-purple-700' :
                                                act.tool === 'Image' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {act.tool}
                                            </span>
                                            <span className="text-[10px] md:text-xs text-gray-400">{new Date(act.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs md:text-sm font-medium text-gray-900 mb-1 line-clamp-2">{act.details}</p>
                                        <p className="text-[10px] md:text-xs text-gray-500 truncate">by {act.name} ({act.email})</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-400 italic text-sm">No activity recorded yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
