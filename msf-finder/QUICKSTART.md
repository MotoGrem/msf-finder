# Quick Start Checklist ✅

Follow these steps to get your MSF Finder live in 1-2 days!

## Day 1: Set Up Database (1-2 hours)

### ☐ Step 1: Create Supabase Account (5 minutes)
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Create new organization (name it anything)

### ☐ Step 2: Create Database (5 minutes)
1. Click "New project"
2. Fill in:
   - Name: `msf-finder`
   - Database Password: Click "Generate password" and SAVE IT
   - Region: East US
   - Plan: Free
3. Click "Create new project"
4. Wait 2-3 minutes ⏳

### ☐ Step 3: Run Database Schema (5 minutes)
1. In Supabase, click "SQL Editor" (left sidebar)
2. Click "New query"
3. Open the file `supabase/schema.sql` from this project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click "Run" button
7. You should see "Success. No rows returned"

### ☐ Step 4: Get API Keys (2 minutes)
1. Click "Settings" (gear icon, left sidebar)
2. Click "API"
3. Copy these TWO values:
   - `Project URL` (example: https://abcdefgh.supabase.co)
   - `anon public` key (long string starting with eyJ...)
4. Save them in a text file - you'll need them soon!

### ☐ Step 5: Verify Sample Data (2 minutes)
1. Click "Table Editor" (left sidebar)
2. Click "courses" table
3. You should see 3 sample courses
4. ✅ If you see them, database is working!

---

## Day 2: Deploy Website (2-3 hours)

### ☐ Step 6: Download Project (5 minutes)
1. Download this entire folder
2. Unzip it somewhere on your computer
3. Open folder in VS Code (or any text editor)

### ☐ Step 7: Add Your Credentials (2 minutes)
1. Find file `.env.local.example`
2. Rename it to `.env.local` (remove the .example)
3. Open it and replace:
   ```
   NEXT_PUBLIC_SUPABASE_URL=paste-your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here
   ```
4. Save the file

### ☐ Step 8: Test Locally (10 minutes)
1. Open Terminal/Command Prompt
2. Navigate to project folder:
   ```bash
   cd path/to/msf-finder
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   (This takes 2-3 minutes)
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open browser to http://localhost:3000
6. ✅ You should see the search page with sample courses!

### ☐ Step 9: Push to GitHub (10 minutes)
1. Create new repository on GitHub:
   - Go to github.com
   - Click "New repository"
   - Name: `msf-finder`
   - Make it public
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. In your terminal (in project folder):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/msf-finder.git
   git push -u origin main
   ```

### ☐ Step 10: Deploy to Vercel (15 minutes)
1. Go to https://vercel.com
2. Click "Sign up" → Use GitHub
3. Click "Import Project"
4. Find your `msf-finder` repository
5. Click "Import"
6. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: ./
   - Everything else: leave default
7. Click "Environment Variables"
8. Add your two variables:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: (paste your Supabase URL)
   - Click "Add"
   
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: (paste your anon key)
   - Click "Add"

9. Click "Deploy"
10. Wait 2-3 minutes ⏳
11. ✅ Your site is live! Click "Visit" to see it!

---

## Day 3: Set Up Automated Scraping (30 minutes)

### ☐ Step 11: Add GitHub Secrets (5 minutes)
1. Go to your GitHub repository
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add TWO secrets:

   **Secret 1:**
   - Name: `SUPABASE_URL`
   - Value: (your Supabase URL)
   - Click "Add secret"

   **Secret 2:**
   - Name: `SUPABASE_KEY`
   - Value: Go to Supabase → Settings → API → Copy `service_role` key (NOT anon!)
   - Click "Add secret"

### ☐ Step 12: Enable GitHub Actions (2 minutes)
1. In your GitHub repo, click "Actions" tab
2. If prompted, click "I understand, enable them"
3. You should see "Scrape MSF Courses" workflow

### ☐ Step 13: Run First Scrape (5 minutes)
1. Click "Scrape MSF Courses" workflow
2. Click "Run workflow" dropdown (right side)
3. Click green "Run workflow" button
4. Wait 2-3 minutes
5. Page will refresh - click the workflow run
6. ✅ If green checkmark appears, it worked!

### ☐ Step 14: Verify Real Data (2 minutes)
1. Go to Supabase → Table Editor → courses
2. Click "Refresh"
3. You should see REAL courses from NC colleges!
4. Go to your Vercel site and search
5. ✅ Real courses should appear!

---

## ✅ You're Done!

Your site is now:
- ✅ Live on the internet
- ✅ Connected to real course data
- ✅ Auto-updating every 6 hours
- ✅ Completely free!

## What to Do Next

### Share It!
- Post in NC motorcycle Facebook groups
- Share on Reddit (r/motorcycles, r/northcarolina)
- Tweet about it
- Tell your riding buddies

### Monitor It
- Check GitHub Actions weekly (make sure scraper is running)
- Check Vercel (make sure site is up)
- Test searches occasionally

### Improve It
- Read the main README.md for customization options
- Add more colleges
- Change colors
- Add features

---

## Troubleshooting

### "Module not found" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Vercel deploy failed
- Check environment variables are correct
- Try deploying again
- Check build logs for specific error

### GitHub Actions failed
- Check that you used service_role key (not anon)
- Verify secrets are named exactly: `SUPABASE_URL` and `SUPABASE_KEY`
- Check Python syntax in scraper

### No courses showing
- Wait for scraper to run (or run manually in Actions)
- Check Supabase courses table has data
- Clear browser cache

---

## Need Help?

1. Check main README.md (more detailed)
2. Google the error message
3. Check Supabase docs: docs.supabase.com
4. Check Vercel docs: vercel.com/docs
5. Ask ChatGPT or Claude!

---

**Estimated Total Time: 3-5 hours**

**Difficulty: Easy** (just follow steps, no coding needed!)

**Cost: $0** (everything is free tier!)

🎉 **Good luck!**
