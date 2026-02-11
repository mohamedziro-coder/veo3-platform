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

export interface Blog {
    id: number;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    cover_image: string;
    published: boolean;
    author_email: string;
    created_at: Date;
    updated_at: Date;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const sql = getDb();
        const emailLower = email.toLowerCase();
        const result = await sql`
            SELECT id, email, name, role, credits, created_at 
            FROM users 
            WHERE LOWER(email) = ${emailLower}
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
        // User asked to stop "bazaf" (many), so 1
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
        const emailLower = email.toLowerCase();

        // Check if user exists
        const existing = await getUserByEmail(emailLower);
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

        // Determine role (admin if specific email or matches env var)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@onlinetools.com';
        const role = (emailLower === adminEmail.toLowerCase() || emailLower === 'admin@onlinetools.com') ? 'admin' : 'user';

        // Insert user
        // Try to insert with signup_ip. If it fails (e.g. column missing), fallback to old insert.
        try {
            const result = await sql`
                INSERT INTO users (name, email, password_hash, role, credits, signup_ip)
                VALUES (${name}, ${emailLower}, ${passwordHash}, ${role}, ${initialCredits}, ${ip || null})
                RETURNING id, email, name, role, credits, created_at
            `;
            return result[0] as User;
        } catch (dbError: any) {
            console.error('Failed to insert with signup_ip, falling back:', dbError.message);
            // Fallback: Insert without signup_ip (migration not run yet)
            const result = await sql`
                INSERT INTO users (name, email, password_hash, role, credits)
                VALUES (${name}, ${emailLower}, ${passwordHash}, ${role}, ${initialCredits})
                RETURNING id, email, name, role, credits, created_at
            `;
            return result[0] as User;
        }
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// Verify user login
export async function verifyUser(email: string, password: string): Promise<any | null> {
    try {
        const sql = getDb();
        const emailLower = email.toLowerCase();
        const result = await sql`
            SELECT id, email, name, role, credits, password_hash
            FROM users 
            WHERE LOWER(email) = ${emailLower}
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
export async function logActivity(
    userEmail: string,
    userName: string,
    tool: string,
    details: string,
    resultUrl?: string
): Promise<boolean> {
    try {
        const sql = getDb();

        // Try with result_url column first (new schema)
        try {
            await sql`
                INSERT INTO activity (user_email, user_name, tool, details, result_url)
                VALUES (${userEmail.toLowerCase()}, ${userName}, ${tool}, ${details}, ${resultUrl || null})
            `;
        } catch (e: any) {
            // Fallback if result_url column doesn't exist yet
            if (e.message?.includes('result_url') || e.message?.includes('column "result_url" of relation "activity" does not exist')) {
                // Auto-migration: Add the column
                try {
                    await sql`ALTER TABLE activity ADD COLUMN IF NOT EXISTS result_url TEXT`;
                    // Retry original insert
                    await sql`
                        INSERT INTO activity (user_email, user_name, tool, details, result_url)
                        VALUES (${userEmail.toLowerCase()}, ${userName}, ${tool}, ${details}, ${resultUrl || null})
                    `;
                } catch (retryError) {
                    console.error('Failed to auto-migrate result_url:', retryError);
                    // Final Fallback: Insert without result_url
                    await sql`
                        INSERT INTO activity (user_email, user_name, tool, details)
                        VALUES (${userEmail.toLowerCase()}, ${userName}, ${tool}, ${details})
                    `;
                }
            } else if (e.message?.includes('relation "activity" does not exist')) {
                // Auto-migration: Create the table
                try {
                    await sql`
                        CREATE TABLE IF NOT EXISTS activity (
                            id SERIAL PRIMARY KEY,
                            user_email TEXT NOT NULL,
                            user_name TEXT,
                            tool TEXT NOT NULL,
                            details TEXT,
                            result_url TEXT,
                            timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                        );
                     `;
                    // Retry original insert
                    await sql`
                        INSERT INTO activity (user_email, user_name, tool, details, result_url)
                        VALUES (${userEmail.toLowerCase()}, ${userName}, ${tool}, ${details}, ${resultUrl || null})
                    `;
                } catch (createError) {
                    console.error('Failed to auto-create activity table:', createError);
                    throw e;
                }
            } else {
                throw e;
            }
        }
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
            SELECT id, user_email, user_name, tool, details, result_url, timestamp 
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
            SELECT id, user_email, user_name, tool, details, result_url, timestamp 
            FROM activity 
            WHERE LOWER(user_email) = ${email.toLowerCase()}
            ORDER BY timestamp DESC
            LIMIT 50
        `;
        return result as Activity[];
    } catch (error) {
        console.error('Error getting user activity:', error);
        return [];
    }
}

// Update verification token
export async function updateVerificationToken(email: string, token: string): Promise<boolean> {
    try {
        const sql = getDb();
        await sql`
            UPDATE users 
            SET verification_token = ${token}, is_verified = FALSE 
            WHERE email = ${email}
        `;
        return true;
    } catch (error) {
        console.error('Error updating verification token:', error);
        return false;
    }
}

// Verify user email
export async function verifyUserEmail(token: string): Promise<User | null> {
    try {
        const sql = getDb();
        const result = await sql`
            UPDATE users 
            SET is_verified = TRUE, verification_token = NULL 
            WHERE verification_token = ${token}
            RETURNING id, email, name, role, credits, created_at
        `;
        return result[0] as User || null;
    } catch (error) {
        console.error('Error verifying user email:', error);
        return null;
    }
}


// Deduct credits from user
export async function deductUserCredits(email: string, amount: number): Promise<number | null> {
    try {
        const sql = getDb();

        // Check if user is admin first - admins have unlimited credits
        const emailLower = email.toLowerCase();
        const userResult = await sql`
            SELECT role, credits
            FROM users
            WHERE LOWER(email) = ${emailLower}
        `;

        if (userResult.length === 0) {
            return null; // User not found
        }

        const user = userResult[0];

        // Admin users have unlimited credits - don't deduct
        if (user.role === 'admin') {
            return user.credits; // Return current credits without deduction
        }

        // For regular users, deduct credits as normal
        const result = await sql`
            UPDATE users 
            SET credits = credits::integer - ${amount}
            WHERE LOWER(email) = ${emailLower} AND credits::integer >= ${amount}
            RETURNING credits
        `;

        if (result.length === 0) {
            return null; // Insufficient credits
        }

        return result[0].credits;
    } catch (error) {
        console.error('Error deducting credits:', error);
        return null;
    }
}

// System Settings (DB-based Config)
export async function saveSystemConfig(key: string, value: any): Promise<boolean> {
    try {
        const sql = getDb();
        const valueJson = JSON.stringify(value);

        // Try insert/update
        try {
            await sql`
                INSERT INTO system_settings (key, value)
                VALUES (${key}, ${valueJson})
                ON CONFLICT (key) DO UPDATE SET value = ${valueJson}
            `;
        } catch (e: any) {
            if (e.message?.includes('relation "system_settings" does not exist')) {
                // Auto-create table
                await sql`
                    CREATE TABLE IF NOT EXISTS system_settings (
                        key TEXT PRIMARY KEY,
                        value TEXT NOT NULL
                    );
                `;
                // Retry
                await sql`
                    INSERT INTO system_settings (key, value)
                    VALUES (${key}, ${valueJson})
                    ON CONFLICT (key) DO UPDATE SET value = ${valueJson}
                `;
            } else {
                throw e;
            }
        }
        return true;
    } catch (error) {
        console.error('Error saving system config:', error);
        return false;
    }
}

export async function getSystemConfig(key: string): Promise<any | null> {
    try {
        const sql = getDb();
        try {
            const result = await sql`SELECT value FROM system_settings WHERE key = ${key}`;
            if (result.length > 0) {
                return JSON.parse(result[0].value);
            }
        } catch (e: any) {
            // Include explicit check for missing table to avoid noise
            if (!e.message?.includes('does not exist')) {
                console.error('Error reading system config:', e);
            }
        }
        return null;
    } catch (error) {
        return null; // Fail gracefully (fallback to env)
    }
}

// --- Blog System Helpers ---

// Get all blogs (for admin or public)
export async function getBlogs(publishedOnly: boolean = true): Promise<Blog[]> {
    try {
        const sql = getDb();
        if (publishedOnly) {
            const result = await sql`
                SELECT * FROM blogs 
                WHERE published = TRUE 
                ORDER BY created_at DESC
            `;
            return result as Blog[];
        } else {
            const result = await sql`
                SELECT * FROM blogs 
                ORDER BY created_at DESC
            `;
            return result as Blog[];
        }
    } catch (error) {
        console.error('Error getting blogs:', error);
        return [];
    }
}

// Get single blog by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
        const sql = getDb();
        const result = await sql`
            SELECT * FROM blogs WHERE slug = ${slug}
        `;
        return result[0] as Blog || null;
    } catch (error) {
        console.error('Error getting blog by slug:', error);
        return null;
    }
}

// Create new blog
export async function createBlog(
    title: string,
    slug: string,
    content: string,
    excerpt: string,
    coverImage: string,
    authorEmail: string,
    published: boolean
): Promise<Blog | null> {
    try {
        const sql = getDb();
        const result = await sql`
            INSERT INTO blogs (title, slug, content, excerpt, cover_image, author_email, published)
            VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${coverImage}, ${authorEmail}, ${published})
            RETURNING *
        `;
        return result[0] as Blog;
    } catch (error) {
        console.error('Error creating blog:', error);
        return null;
    }
}

// Update blog
export async function updateBlog(
    id: number,
    data: Partial<Omit<Blog, 'id' | 'created_at' | 'updated_at'>>
): Promise<Blog | null> {
    try {
        const sql = getDb();

        // Dynamic update query construction
        const updates: any = {};
        if (data.title !== undefined) updates.title = data.title;
        if (data.slug !== undefined) updates.slug = data.slug;
        if (data.content !== undefined) updates.content = data.content;
        if (data.excerpt !== undefined) updates.excerpt = data.excerpt;
        if (data.cover_image !== undefined) updates.cover_image = data.cover_image;
        if (data.published !== undefined) updates.published = data.published;

        updates.updated_at = new Date();

        const result = await sql`
            UPDATE blogs 
            SET ${sql(updates)}
            WHERE id = ${id}
            RETURNING *
        `;
        return result[0] as Blog;
    } catch (error) {
        console.error('Error updating blog:', error);
        return null;
    }
}

// Delete blog
export async function deleteBlog(id: number): Promise<boolean> {
    try {
        const sql = getDb();
        await sql`DELETE FROM blogs WHERE id = ${id}`;
        return true;
    } catch (error) {
        console.error('Error deleting blog:', error);
        return false;
    }
}
