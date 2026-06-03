# All Odisha Update 📰

**All Odisha Update** is a fully functional, mobile-first web application designed to deliver short, crisp, and reliable news updates (similar to Inshorts) tailored for Odisha. It covers Odisha local news, national news, government schemes (like Subhadra Yojana), jobs, banking updates, technology news, and public awareness.

The application features a professional Red, White, and Dark Blue news portal theme, a dynamic breaking news ticker, instant search, a LocalStorage-backed bookmarking and theme system (Light/Dark), loading skeleton screens, and offline network state alerts. It is powered by a robust Node.js/Express backend, MongoDB, and incorporates the Google Gemini API to automatically parse URLs, extract content, and generate 50-80 word summaries in Odia along with matching headlines and tags.

---

## 🚀 Tech Stack

- **Frontend**: HTML5 (Semantic Structure), CSS3 (Custom Variables, Light/Dark Modes, Keyframe Animations), Vanilla JavaScript (ES6+, IntersectionObserver, Web Share API)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: Google Gemini 1.5 Flash (via `@google/generative-ai`)
- **Scraper**: Cheerio & Axios (content parsing)

---

## 📂 Project Structure

```
all-odisha-update/
├── package.json         # Node dependencies and npm script bindings
├── server.js            # Express application bootstrap & entry point
├── .env                 # Environment configurations (Port, MongoDB URI, Gemini Key)
├── config/
│   └── db.js            # Mongoose MongoDB connection client
├── models/
│   ├── News.js          # Mongoose model for News articles & search index
│   └── User.js          # Mongoose model for Admin credentials & bookmarks
├── middleware/
│   └── auth.js          # JWT token verification middleware for secure endpoints
├── services/
│   ├── gemini.js        # Google Gemini AI translation & summarization service
│   └── scraper.js       # Cheerio-based web page parser for article scraping
├── routes/
│   ├── news.js          # Public REST API routes for news feed, search, and details
│   ├── admin.js         # Protected admin CRUD & dashboard analytics routes
│   └── ai.js            # Protected AI processing & auto-fill endpoints
├── public/              # Client-side static resources (served by Express)
│   ├── index.html       # Primary news reading interface (mobile-first)
│   ├── login.html       # Admin credentials panel / developer init page
│   ├── admin.html       # Administrative dashboard & AI curation panel
│   ├── css/
│   │   ├── style.css    # Core design styles, light/dark themes & animations
│   │   └── admin.css    # Admin dashboard panel styling, metrics & grids
│   ├── js/
│   │   ├── app.js       # Main client-side handler (lazy load, scroll observer)
│   │   ├── login.js     # Admin sign-in validation & token storage handler
│   │   └── admin.js     # Dashboard state manager & Gemini AI orchestrator
│   ├── robots.txt       # Search engine crawler directives
│   └── sitemap.xml      # XML sitemap configuration
├── seed.js              # Database seed script for initial testing data
└── README.md            # Installation & usage manual
```

---

## 🛠️ Installation & Setup

Follow these steps to run the application locally on your system:

### 1. Prerequisites
- Ensure **Node.js** (v18 or higher) is installed.
- Ensure **MongoDB** is running locally or you have access to a **MongoDB Atlas** connection string.

### 2. Install Dependencies
Navigate to the project root directory and run:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (or edit the existing one) with the following fields:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/all_odisha_update
JWT_SECRET=super_secret_odisha_update_jwt_key_99
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
```
> **Note**: If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string (e.g., `mongodb+srv://...`).

### 4. Seed the Database
To populate the database with initial news cards, job postings, sponsored advertisements, and create the default administrator account, execute:
```bash
node seed.js
```
Upon successful execution, a default admin account is created:
- **Email**: `admin@allodishaupdate.com`
- **Password**: `adminpassword123`

### 5. Start the Application
To run the server in production/normal mode:
```bash
npm start
```
For automatic code reloading during development (requires nodemon):
```bash
npm run dev
```

The server will spin up on **`http://localhost:5001`**.

---

## 📘 Operational Guide & Features

### 1. Main Client App (`http://localhost:5001/`)
- **News Feed**: Displays short, scrollable news cards with high-quality featured images, English/Odia headlines, source metadata, views, and Odia summaries.
- **Horizontal Navigation**: Instant filter by categories (Odisha, Schemes, Jobs, Banking, Tech, etc.) by clicking chips.
- **Breaking News Ticker**: Dynamic marquee at the top showing the latest headlines.
- **Instant Search**: Tap the magnifying glass icon, type keywords (e.g., "Subhadra"), and view instant card matches in the search drawer.
- **Local Storage Bookmarks**: Click the bookmark icon on any card to save it locally. Access and read them anytime using the Bookmarks modal drawer.
- **Theme Engine**: Toggle between Light and Dark themes dynamically. The preference is stored in LocalStorage.
- **Ad Integrations**: Embedded sponsored ads appear periodically in the news feed and sidebar widgets.

### 2. Admin Dashboard & Curation Panel (`http://localhost:5001/login.html`)
- **First-Time Registration**: If no admins are configured, toggle "First-time Setup" on the login page and enter the secret code `OdishaAdmin2026` to register your administrator account.
- **Analytics Metrics**: Real-time counter widgets for Total Posts, Cumulative Views, Job Postings, and Ad Counts. Includes sidebar metrics for popular posts (highest views) and category distribution.
- **Gemini AI Summarization Workflow**:
  1. Go to the "Gemini AI Smart Summarizer" box at the top.
  2. Paste a news article URL (e.g., a link from OTV or Sambad) or paste raw text.
  3. Click **"Run Gemini AI Auto-Fill"**.
  4. The scraper fetches the HTML, and the Gemini 1.5 Flash model reads the text to:
     - Generate a catchy English Headline.
     - Generate an Odia Headline.
     - Formulate a 50-80 word summary strictly in Odia.
     - Identify 3-5 relevant hashtags.
  5. The fields in the "Publish News Card" form below are automatically filled with the AI output.
  6. The administrator can review the content, tweak the text, modify tags, tick flags ("Mark Trending", "Sponsored Ad", "Job Posting"), and hit **"Publish Article"** to store it in MongoDB.
- **News Database Table**: A paginated view of all articles in the database. Supports editing (fills form for updates) and deleting with confirmations.
