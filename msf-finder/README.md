# NC Motorcycle Safety Class Finder

A Next.js web application that helps users find MSF (Motorcycle Safety Foundation) Basic RiderCourse classes at North Carolina community colleges.

![MSF Finder](https://via.placeholder.com/800x400?text=NC+MSF+Class+Finder)

## Features

- 🔍 Search classes by ZIP code
- 📍 Shows distance to each college
- 💺 Real-time seat availability
- 📅 Upcoming class dates and times
- 💰 Pricing information
- 🔗 Direct registration links
- 📱 Mobile-responsive design
- 🔄 Auto-updates every 6 hours

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (Frontend), GitHub Actions (Scraper)
- **Scraping**: Python with Beautiful Soup

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (free)
- Vercel account (free)
- GitHub account (free)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/msf-finder.git
cd msf-finder
```

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign in with GitHub
3. Create a new project:
   - Organization: Create new or select existing
   - Name: `msf-finder`
   - Database Password: Generate a strong password
   - Region: East US (or closest to you)
   - Pricing Plan: Free

4. Wait 2-3 minutes for provisioning

5. Once ready, go to **SQL Editor** and run the schema:
   - Copy the contents of `supabase/schema.sql`
   - Paste into SQL Editor
   - Click "Run"

6. Get your API credentials:
   - Go to **Settings** → **API**
   - Copy `Project URL` (e.g., https://abcdefgh.supabase.co)
   - Copy `anon public` key (starts with eyJ...)

### Step 3: Configure Environment Variables

1. Create `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the search page with sample data!

## Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

6. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

7. Click "Deploy"

Your site will be live at `https://your-project.vercel.app`!

### Set Up Automated Scraping

1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**

2. Add secrets:
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_KEY`: Your Supabase **service_role** key (from Settings → API)
     - ⚠️ Use service_role key for scraper, not anon key!

3. Enable GitHub Actions:
   - Go to **Actions** tab
   - Enable workflows if prompted

4. The scraper will now run automatically every 6 hours!

5. To run manually:
   - Go to **Actions** tab
   - Select "Scrape MSF Courses" workflow
   - Click "Run workflow"

## Project Structure

```
msf-finder/
├── .github/
│   └── workflows/
│       └── scraper.yml          # GitHub Actions workflow
├── components/
│   ├── CourseCard.js            # Course display component
│   └── SearchBox.js             # Search input component
├── lib/
│   └── supabase.js              # Supabase client config
├── pages/
│   ├── _app.js                  # Next.js app wrapper
│   └── index.js                 # Main search page
├── scraper/
│   └── fundfive_scraper_supabase.py  # Python scraper
├── styles/
│   └── globals.css              # Global styles
├── supabase/
│   └── schema.sql               # Database schema
├── .env.local.example           # Environment variables template
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS config
├── tailwind.config.js           # Tailwind CSS config
└── README.md                    # This file
```

## How It Works

### 1. Data Collection (Scraper)

The Python scraper runs every 6 hours via GitHub Actions:

1. Visits each FundFive college's registration page
2. Calls the `/loadcourses` API endpoint
3. Parses the JSON response
4. Extracts course details (date, time, seats, price, etc.)
5. Saves to Supabase database

### 2. Website (Frontend)

When a user searches by ZIP code:

1. Frontend queries Supabase for all upcoming courses
2. Calculates distance from user's ZIP to each college
3. Filters courses within 100 miles
4. Sorts by distance
5. Displays results with seat availability

### 3. Data Flow

```
GitHub Actions (Every 6 hours)
    ↓
Python Scraper
    ↓
FundFive API (6 colleges)
    ↓
Supabase Database
    ↓
Next.js Frontend (Vercel)
    ↓
User's Browser
```

## Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#your-color',  // Main blue color
      },
    },
  },
}
```

### Change Search Radius

Edit `pages/index.js`, line ~40:

```javascript
const nearbyCourses = coursesWithDistance
  .filter(course => course.distance <= 50)  // Change 50 to your preferred miles
```

### Add More Colleges

1. Find the college's FundFive URL
2. Add to `scraper/fundfive_scraper_supabase.py`:

```python
{
    'name': 'New College Name',
    'subdomain': 'newcollege',
    'filter': 'motorcycle',
    'city': 'City Name',
    'zipcode': '12345',
    'latitude': 35.0000,
    'longitude': -80.0000
}
```

### Change Update Frequency

Edit `.github/workflows/scraper.yml`:

```yaml
schedule:
  - cron: '0 */3 * * *'  # Every 3 hours instead of 6
```

## Troubleshooting

### "Missing Supabase environment variables"

Make sure `.env.local` exists and has correct values:
- Check for typos
- Ensure no extra spaces
- Restart dev server after changes

### Scraper Not Running

1. Check GitHub Actions tab for errors
2. Verify secrets are set correctly
3. Make sure service_role key is used (not anon key)
4. Check Python syntax in scraper

### No Courses Showing

1. Check Supabase → Table Editor → `courses` table has data
2. Run scraper manually in GitHub Actions
3. Check browser console for errors
4. Verify Supabase RLS policies are enabled

### Deployment Failed

1. Check build logs in Vercel
2. Ensure all dependencies are in package.json
3. Verify environment variables are set
4. Try `npm run build` locally first

## Adding Features

### Email Alerts

1. Add user email to database
2. Check for new classes matching user's ZIP
3. Send email via Resend or SendGrid
4. Run check in GitHub Actions

### SMS Alerts

1. Sign up for Twilio
2. Similar to email alerts
3. Send SMS when seats become available

### Advanced Distance Calculation

Replace ZIP code math with geocoding:

```bash
npm install geolib
```

```javascript
import { getDistance } from 'geolib';

const distance = getDistance(
  { latitude: userLat, longitude: userLng },
  { latitude: collegeLat, longitude: collegeLng }
) / 1609.34; // Convert meters to miles
```

## Performance

- Frontend: Served from Vercel's global CDN (fast!)
- Database: Supabase PostgreSQL (indexed queries)
- Scraper: Runs async, doesn't affect site speed

**Expected load times:**
- Initial page load: <1 second
- Search results: <500ms
- Mobile: Optimized for 3G

## Cost Breakdown

**Free Forever:**
- Supabase: Up to 500MB database (plenty!)
- Vercel: Unlimited bandwidth
- GitHub Actions: 2,000 minutes/month (you use ~300)

**If you grow:**
- Supabase Pro: $25/month (8GB database)
- Vercel Pro: $20/month (priority support)
- Custom domain: $12/year

## Contributing

Want to help improve this? Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

Issues? Questions?

- Open a [GitHub Issue](https://github.com/yourusername/msf-finder/issues)
- Email: your@email.com

## License

MIT License - feel free to use this for your own projects!

## Acknowledgments

- FundFive for providing the course data API
- North Carolina Community Colleges for offering MSF courses
- Supabase for amazing free database hosting
- Vercel for free frontend hosting

## Roadmap

- [ ] Add email alerts for new classes
- [ ] Add more NC colleges (Ellucian system)
- [ ] Expand to other states
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for colleges
- [ ] Reviews/ratings system
- [ ] Integration with DMV for certification

---

Built with ❤️ for NC riders

**Happy riding! 🏍️**
