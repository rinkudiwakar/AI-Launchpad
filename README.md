
##                                                     🚀 Learning Tracker

> Your personal command center for mastering AI engineering in 18 months

<img src="https://socialify.git.ci/rinkudiwakar/Daily-Tracking/image?language=1&amp;owner=1&amp;name=1&amp;stargazers=1&amp;theme=Light" alt="project-image">
A comprehensive full-stack learning management system built for aspiring AI engineers who want to transform their learning journey into a visual, trackable, and shareable experience.

## ✨ What It Does

Track your entire AI engineering journey in one powerful dashboard:

- **📝 Task Management** - Daily focus tracker with project links that automatically populate your learning history
- **🗺️ Custom Roadmap** - Editable 18-month learning path with hierarchical sub-roadmaps for deep dives
- **📊 Professional Hub** - Centralized view of your GitHub repos, LeetCode stats, Medium articles, and all coding profiles
- **📚 Learning Tracker** - Permanent log of completed topics with searchable, filterable achievements
- **📅 Calendar Sync** - One-click sync of learning tasks to Google Calendar
- **👤 Portfolio Profile** - Editable profile with avatar upload and bio

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Routing:** React Router v6
- **APIs:** GitHub, LeetCode, Medium RSS, Google Calendar
- **Icons:** Lucide React

## 🎯 Perfect For

- Self-taught developers transitioning to AI/ML
- Bootcamp graduates building structured learning paths
- Students documenting their computer science journey
- Anyone who wants to track learning progress with data-driven insights

## 🌟 Key Features

### Smart Task Management
- Add tasks with optional project links
- Checkbox completion triggers automatic learning log
- Tasks persist across sessions in Supabase

### Dynamic Professional Hub
- **GitHub:** Auto-fetch and display your repositories
- **LeetCode:** Real-time problem-solving statistics
- **Medium:** Live feed of your latest articles
- **Multi-platform:** LinkedIn, Twitter, Kaggle, HackerRank integration

### Flexible Roadmap System
- Create custom learning milestones
- Add nested sub-roadmaps (e.g., DSA deep-dive under Foundations)
- Fully editable - add, update, or delete at any time
- Data persists in database for long-term planning

### Learning Analytics
- Total completed tasks counter
- Monthly completion trends
- Tasks with project links tracker
- Searchable and sortable achievement history

<h2>🚀 Demo</h2>

[AILaunchpad](https://ailaunchpad.vercel.app/)

## 🚦 Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-learning-dashboard.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials

# Run development server
npm run dev
```

## 📦 Database Setup

Run the SQL scripts in `/database` folder in your Supabase SQL Editor:
1. `01_create_tables.sql` - Creates profiles, tasks, resources, roadmaps tables
2. `02_setup_storage.sql` - Sets up avatar storage bucket
3. `03_rls_policies.sql` - Configures Row Level Security

## 🔐 Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CALENDAR_API_KEY=your_google_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📸 Screenshots

<img width="2750" height="1273" alt="image" src="https://github.com/user-attachments/assets/9709068c-c3b6-4b03-8725-6477d2994295" />

<img width="2842" height="1576" alt="image" src="https://github.com/user-attachments/assets/bb949750-cd27-4cea-91ae-b481790d7f0d" />

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own learning journey!

## 🙏 Acknowledgments

Built as part of my 18-month AI engineering transformation journey. Inspired by the need for a centralized learning hub that goes beyond simple to-do lists.

## 📬 Connect

- GitHub: [@rinkudiwakar](https://github.com/rinkudiwakar)
- LinkedIn: [Rinku Diwakar](https://linkedin.com/in/rinkudiwakar)
- Twitter: [@mrdiwakar](https://twitter.com/mrdiwakar)



⭐ Star this repo if you're also on an AI learning journey!




## GitHub Topics/Tags (add these to your repo)
```
react
vite
supabase
tailwindcss
learning-management
portfolio
dashboard
ai-engineering
machine-learning
personal-development
self-learning
productivity
full-stack
postgresql
education
```
