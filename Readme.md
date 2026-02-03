# AI-Assisted Business Dashboard

A multi-tenant SaaS web application for freelancers and small teams to manage business operations, view analytics, and receive AI-generated insights.

![Dashboard Preview](https://via.placeholder.com/800x400?text=AI+Business+Dashboard)

## 🚀 Features

- **📊 Dashboard Analytics** - Real-time KPIs including revenue, expenses, profit margins, and growth trends
- **👥 Client Management** - Full CRUD for managing client relationships
- **📄 Invoice Tracking** - Create, track, and manage invoices with status filters
- **💸 Expense Tracking** - Categorized expense management with monthly summaries
- **🔮 Forecasting** - Simple revenue predictions using moving averages and trend analysis
- **🤖 AI Insights** - AI-generated business summaries, risk detection, and action recommendations
- **🔒 Secure Auth** - Supabase authentication with Row Level Security

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS with CSS Variables |
| Backend | Supabase (PostgreSQL + Auth) |
| Charts | Chart.js + react-chartjs-2 |
| AI | OpenAI API (optional) |
| Dates | date-fns |

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account (free tier works)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd AI-ABD
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy your:
   - Project URL
   - anon/public key
3. Run the database schema:
   - Go to **SQL Editor** in Supabase dashboard
   - Paste contents of `supabase/schema.sql`
   - Click **Run**

### 3. Configure Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: For AI insights
VITE_OPENAI_API_KEY=your-openai-key
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
src/
├── components/
│   ├── ai/              # AI insights components
│   ├── dashboard/       # Dashboard widgets (KPIs, charts)
│   ├── layout/          # DashboardLayout, sidebar
│   └── ui/              # Reusable UI (Spinner, etc.)
├── context/
│   ├── AuthContext.jsx  # Authentication state
│   └── BusinessContext.jsx # Business data state
├── pages/
│   ├── Dashboard.jsx    # Main analytics dashboard
│   ├── Clients.jsx      # Client management
│   ├── Invoices.jsx     # Invoice management
│   ├── Expenses.jsx     # Expense tracking
│   ├── Insights.jsx     # AI insights page
│   ├── Landing.jsx      # Public landing page
│   ├── Login.jsx        # Authentication
│   ├── Signup.jsx       # Registration
│   └── Onboarding.jsx   # Business setup
├── services/
│   ├── supabase.js      # Supabase client + DB helpers
│   ├── analytics.js     # Analytics calculations
│   ├── forecasting.js   # Prediction algorithms
│   └── ai.js            # AI/OpenAI integration
├── styles/
│   └── index.css        # Global design system
└── utils/
    └── formatters.js    # Formatting utilities
```

## 🔐 Authentication Flow

1. **Unauthenticated** → Landing page with signup/login
2. **Authenticated, no business** → Onboarding flow
3. **Authenticated + business** → Dashboard

## 📈 Analytics Architecture

All analytics are **deterministic** and calculated from stored data:

- **Revenue**: Sum of paid invoices
- **Expenses**: Sum of all expenses
- **Profit**: Revenue - Expenses
- **Month-over-Month Growth**: Comparing current vs previous month
- **Top Clients**: Aggregated by paid invoice amounts

AI is only used for:
- Generating natural language summaries
- Suggesting actions based on metrics
- Risk detection and warnings

## 🤖 AI Integration

The AI integration is **optional**. Without an OpenAI API key, the app uses rule-based insights that still provide useful feedback.

When configured, AI provides:
- Business health summaries
- Risk identification
- Opportunity detection
- Actionable recommendations

## 🗄️ Database Schema

See `supabase/schema.sql` for the complete schema. Tables include:

- `businesses` - User's business profile
- `clients` - Customer records
- `invoices` - Invoice tracking with status
- `expenses` - Categorized expense records

All tables use Row Level Security (RLS) to ensure data isolation.

## 🧪 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the static bundle with `npm run build`, output is in `/dist`.

## 📜 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Supabase](https://supabase.com)
- [Chart.js](https://chartjs.org)
- [date-fns](https://date-fns.org)
