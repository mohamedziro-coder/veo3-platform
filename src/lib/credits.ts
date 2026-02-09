"use client";

// Credit Costs
export const COSTS = {
    VIDEO: 100,
    IMAGE: 5,
    VOICE: 2
};

export const INITIAL_CREDITS = 50;
export const ADMIN_CREDITS = 100;

export function getUserCredits(): number {
    if (typeof window === 'undefined') return 0;

    try {
        const userStr = localStorage.getItem('current_user');
        if (!userStr) return 0;

        const user = JSON.parse(userStr);
        // If credits key doesn't exist, return 0 (or handle migration elsewhere)
        return typeof user.credits === 'number' ? user.credits : 0;
    } catch (e) {
        console.error("Error reading credits:", e);
        return 0;
    }
}

export function deductCredits(amount: number): boolean {
    if (typeof window === 'undefined') return false;

    try {
        const userStr = localStorage.getItem('current_user');
        if (!userStr) return false;

        const user = JSON.parse(userStr);
        const currentCheck = typeof user.credits === 'number' ? user.credits : 0;

        if (currentCheck < amount) {
            return false;
        }

        user.credits = currentCheck - amount;
        localStorage.setItem('current_user', JSON.stringify(user));

        // Dispatch event so UI updates immediately
        window.dispatchEvent(new Event('storage'));

        // Use a custom event for smoother internal updates if needed
        window.dispatchEvent(new Event('credits-updated'));

        return true;
    } catch (e) {
        console.error("Error deducting credits:", e);
        return false;
    }
}

export function formatCredits(credits: number): string {
    return credits.toLocaleString();
}
