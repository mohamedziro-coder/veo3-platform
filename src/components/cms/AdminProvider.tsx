"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Edit, Eye, Save } from "lucide-react";

interface AdminContextType {
    isEditMode: boolean;
    isAdmin: boolean;
    toggleEditMode: () => void;
}

const AdminContext = createContext<AdminContextType>({
    isEditMode: false,
    isAdmin: false,
    toggleEditMode: () => { },
});

export const useAdmin = () => useContext(AdminContext);

export default function AdminProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const checkAdmin = () => {
            const userStr = localStorage.getItem('current_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setIsAdmin(user.role === 'admin');
            }
        };
        checkAdmin();
        window.addEventListener('storage', checkAdmin);
        return () => window.removeEventListener('storage', checkAdmin);
    }, []);

    const toggleEditMode = () => setIsEditMode(!isEditMode);

    return (
        <AdminContext.Provider value={{ isEditMode, isAdmin, toggleEditMode }}>
            {children}
            {isAdmin && (
                <div className="fixed bottom-6 right-6 z-[100]">
                    <button
                        onClick={toggleEditMode}
                        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-xl font-bold transition-all ${isEditMode
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "bg-card-bg border border-card-border text-foreground hover:bg-muted"
                            }`}
                    >
                        {isEditMode ? <><Eye className="w-5 h-5" /> View Mode</> : <><Edit className="w-5 h-5" /> Edit Content</>}
                    </button>
                </div>
            )}
        </AdminContext.Provider>
    );
}
