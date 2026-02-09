import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Get Neon connection
function getDb() {
    if (!process.env.POSTGRES_URL) {
        throw new Error('POSTGRES_URL environment variable not found. Please add it to .env.local');
    }
    return neon(process.env.POSTGRES_URL);
}

// User types
export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    credits: number;
    created_at: Date;
}

export interface Activity {
    id: number;
    user_email: string;
    user_name: string;
    tool: string;
    details: string;
    timestamp: Date;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const sql = getDb();
        const result = await sql`
            SELECT id, email, name, role, credits, created_at 
            FROM users 
            WHERE email = ${email}
        `;
        return result[0] as User || null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

// Check IP usage
export async function checkIpUsage(ip: string): Promise<boolean> {
    try {
        const sql = getDb();
        const result = await sql`
            SELECT COUNT(*) as count FROM users WHERE signup_ip = ${ip}
        `;
        // Limit to 1 account per IP (Strict) or 2 (Lenient)
        // User asked to stop "bazaf" (many), so 1 is safest to prevent free credit abuse.
        return parseInt(result[0].count) < 1;
    } catch (error) {
        // If column doesn't exist yet, we might want to allow (fail open) or block (fail closed).
        // For now, log error and allow to avoid breaking app before migration.
        console.error('Error checking IP usage:', error);
        return true;
    }
}

// Create new user
export async function createUser(name: string, email: string, password: string, ip?: string): Promise<User | null> {
    try {
        const sql = getDb();

        // Check if user exists
        const existing = await getUserByEmail(email);
        if (existing) {
            throw new Error('User already exists with this email');
        }

        // Check IP Limit
        let initialCredits = 50;
        if (ip) {
            const isNewIp = await checkIpUsage(ip);
            if (!isNewIp) {
                // User creates duplicate account -> 0 credits penalty
                initialCredits = 0;
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Determine role (admin if specific email, otherwise user)
        const role = email === 'admin@onlinetools.com' ? 'admin' : 'user';

        // Insert user
        // Note: This assumes signup_ip column exists. User needs to run migration.
        const result = await sql`
            INSERT INTO users (name, email, password_hash, role, credits, signup_ip)
            VALUES (${name}, ${email}, ${passwordHash}, ${role}, ${initialCredits}, ${ip || null})
            RETURNING id, email, name, role, credits, created_at
        `;

        return result[0] as User;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// Verify user login
export async function verifyUser(email: string, password: string): Promise<User | null> {
    try {
        const sql = getDb();

        // Get user with password hash
        const result = await sql`
            SELECT id, email, name, password_hash, role, credits, created_at 
            FROM users 
            WHERE email = ${email}
        `;

        if (result.length === 0) {
            return null;
        }

        const user = result[0] as User & { password_hash: string };

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return null;
        }

        // Return user without password hash
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    } catch (error) {
        console.error('Error verifying user:', error);
        return null;
    }
}

// Get all users (for admin)
export async function getAllUsers(): Promise<User[]> {
    try {
        const sql = getDb();
        const result = await sql`
            SELECT id, email, name, role, credits, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;
        return result as User[];
    } catch (error) {
        console.error('Error getting all users:', error);
        return [];
    }
}

// Delete user
export async function deleteUser(email: string): Promise<boolean> {
    try {
        const sql = getDb();
        await sql`DELETE FROM users WHERE email = ${email}`;
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
}

// Log activity
export async function logActivity(userEmail: string, userName: string, tool: string, details: string): Promise<boolean> {
    try {
        const sql = getDb();
        await sql`
            INSERT INTO activity (user_email, user_name, tool, details)
            VALUES (${userEmail}, ${userName}, ${tool}, ${details})
        `;
        return true;
    } catch (error) {
        console.error('Error logging activity:', error);
        return false;
    }
}

// Get all activity
export async function getAllActivity(): Promise<Activity[]> {
    try {
        const sql = getDb();
        const result = await sql`
            SELECT id, user_email, user_name, tool, details, timestamp 
            FROM activity 
            ORDER BY timestamp DESC
            LIMIT 100
        `;
        return result as Activity[];
    } catch (error) {
        console.error('Error getting activity:', error);
        return [];
    }
}

// Get user activity
export async function getUserActivity(email: string): Promise<Activity[]> {
    try {
        const sql = getDb();
        const result = await sql`
            SELECT id, user_email, user_name, tool, details, timestamp 
            FROM activity 
            WHERE user_email = ${email}
            ORDER BY timestamp DESC
            LIMIT 50
        `;
        return result as Activity[];
    } catch (error) {
        console.error('Error getting user activity:', error);
        return [];
    }
}
