# Supabase Setup Guide

## Step 1: Create User in Supabase Dashboard

1. **Go to your Supabase project dashboard**
2. **Click on "Authentication" in the left sidebar**
3. **Click on "Users" tab**
4. **Click "Add user" button**
5. **Fill in the form:**
   - Email: `demo@empresa.cl`
   - Password: `DemoPass123!`
   - Email confirm: ✅ (checked)
6. **Click "Create user"**

## Step 2: Get the User UUID

1. **After creating the user, you'll see them in the users list**
2. **Click on the user row to expand details**
3. **Copy the "id" field** (it's a long UUID like: `550e8400-e29b-41d4-a716-446655440000`)

## Step 3: Update and Run the Seed Script

1. **Open `supabase-seed-manual.sql`**
2. **Find line 10:** `v_user_id uuid := 'PASTE_USER_UUID_HERE';`
3. **Replace `PASTE_USER_UUID_HERE` with your copied UUID**
4. **Keep the single quotes!**
   
   Example:
   ```sql
   v_user_id uuid := '550e8400-e29b-41d4-a716-446655440000';
   ```

5. **Go to Supabase Dashboard → SQL Editor**
6. **Paste the entire updated script**
7. **Click "Run"**

## Step 4: Test Your App

1. **In your terminal, navigate to the project folder:**
   ```bash
   cd C:\Desarrollo_Cursor\leyprotecciondatos
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser to `http://localhost:3000`**

4. **Sign in with:**
   - Email: `demo@empresa.cl`
   - Password: `DemoPass123!`

## What You'll See

After successful setup:
- ✅ Working login with the demo user
- ✅ Sample data in all modules (RoPA, DSAR, Documents, Tasks)
- ✅ All navigation working
- ✅ Functional compliance roadmap with 6 phases
- ✅ Interactive checklists with sample items
- ✅ Project management workspace with Kanban board

## If You Get Stuck

Common issues and solutions:

**"User not found"** → Make sure you created the user in Authentication > Users first

**"Permission denied"** → Check that your user UUID is correct in the script

**"Column does not exist"** → Make sure you ran the main database schema first

**App won't start** → Make sure you're in the right directory and ran `npm install`

**Login fails** → Verify email/password exactly match what you created

Let me know which step you're on and if you need help!

