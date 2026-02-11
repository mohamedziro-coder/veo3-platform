# Quick Neon Database Setup Guide

## Step 1: Create Neon Account & Get Connection String

1. **Open Neon Console:** https://console.neon.tech

2. **Sign Up/Login:**
   - Click "Sign up" or "Sign in"
   - Use GitHub, Google, or Email (fastest with GitHub/Google)

3. **Create a Project:**
   - Click "Create a project" or "New Project"
   - Give it a name (e.g., "Virezo Platform")
   - Select a region (closest to you)
   - Click "Create Project"

4. **Copy Connection String:**
   - After project creation, you'll see a **Connection Details** section
   - Look for "Connection string" or "Database URL"
   - It will look like:
     ```
     postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
     ```
   - **Copy the entire string**

5. **Paste it here in the chat** and I'll add it to `.env.local` immediately!

## Alternative: Find Existing Connection String

If you already created a Neon project:
1. Go to https://console.neon.tech
2. Select your project
3. Go to "Dashboard" or "Connection Details"
4. Copy the connection string
5. Paste it here

---

**Once you provide the connection string, I will:**
✅ Add it to `.env.local`
✅ Run verification script
✅ Initialize database tables
✅ Test blog publishing
