# PeakForm

**PeakForm** is a high-performance training diary that unites **body, fuel, and mind** in a single daily log.  
It helps athletes and high performers capture the essentials — structured workout details, nutrition and macro balance, and mental wellbeing — so patterns emerge and progress is visible over time.

Built with **Next.js** and **Supabase**, PeakForm is designed for clarity, simplicity, and consistency.

---

## ✨ Features

- **Training log**: Capture runs, strength sessions, heart rate, RPE, and more.
- **Nutrition**: Track calories and macros, with day-to-day calorie targets.
- **Mindset**: Log mood, stress, sleep quality, and sleep hours.
- **Charts & insights**:
  - Calories vs Target
  - Macro composition
  - Rolling 7-day distance
  - Training load (acute vs chronic)
  - Training polarization
  - Sleep (daily, rolling averages, balance)
- **End-of-day prompt**: Auto-generated summary you can copy into your notes or share.
- **TXT import/export**: Structured text template for quick logging and backups.
- **Privacy first**: No advertising, no third-party data sharing. See [Privacy Policy](./app/privacy/page.tsx).
- **Legal**: See [Terms of Service](./app/terms/page.tsx).

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) – React framework for production apps
- [Supabase](https://supabase.com/) – backend database & authentication
- [Tailwind CSS](https://tailwindcss.com/) – utility-first styling
- [Recharts](https://recharts.org/en-US/) – data visualization
- [Vercel](https://vercel.com/) – deployment & hosting

---

## 🚀 Getting Started (for local dev)

> PeakForm is designed to deploy automatically to Vercel. If you want to run locally:

```bash
# clone the repo
git clone https://github.com/werunultras/peakform.git
cd peakform

# install dependencies
npm install

# run the dev server
npm run dev

app/
  diary/        # Main training diary
  privacy/      # Privacy Policy page
  terms/        # Terms of Service page
  layout.tsx    # Global layout (header, footer)
components/     # Reusable components (e.g., HeroBg, HeaderAuth)
lib/            # Types and storage helpers
public/         # Static assets (background image, icons)