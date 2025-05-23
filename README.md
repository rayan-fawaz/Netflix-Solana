A Netflix-style streaming platform for Solana meme coins. Discover, track, and trade the hottest meme coins with a familiar interface.

## 🚀 Features

- **Netflix-Style UI** for browsing meme coins
- **Live Coin Tracking** with real-time Pump.fun data
- **Multiple Categories**: Live Now, Featured, Pump.fun Originals, Trending
- **Detailed Coin Pages** with market data and social links
- **Profile System** with custom avatars
- **Responsive Design** for all devices


## 🛠️ Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS + shadcn/ui
- Pump.fun API + DexScreener API


## 📦 Quick Start

```shellscript
git clone https://github.com/rayan-fawaz/Netflix-Solana
cd netflix-fun
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```plaintext
app/
├── api/coins/          # API routes for coin data
├── category/           # Category pages
├── coin/              # Individual coin pages
└── home/              # Main dashboard

components/
├── ui/                # shadcn/ui components
├── navbar.tsx         # Navigation
├── hero-banner.tsx    # Featured coin banner
└── *-coins-row.tsx    # Coin carousels

utils/                 # Helper functions
```

## 🔌 API Endpoints

- `/api/coins/live` - Currently live coins
- `/api/coins/featured` - Featured micro-cap coins
- `/api/coins/pumpfun-originals` - Top Pump.fun coins
- `/api/coins/trending` - Trending coins
- `/api/coins/dexscreener/[mint]` - DexScreener data


## 🚀 Deploy

Deploy to Vercel with one click or any Node.js hosting provider.

#Live View

view it live at [Visit Netflix Solana](https://netflixsolana.com)

## 📝 License

MIT License

---

**Made for the Solana meme coin community**

*Always DYOR before investing in cryptocurrencies.*
