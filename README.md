# Uni-GPT Voice Assistant

🎙️ Professional voice-powered AI assistant for UniQube bathroom pods and kitchens. Built with Next.js, OpenAI GPT-4o-mini, and Web Speech API.

![Uni-GPT](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)

## ✨ Features

- **🎤 Voice-First Interface** - Hands-free interaction using Web Speech API
- **🔒 Secure Backend** - API keys stored server-side, never exposed to client
- **🧠 GPT-4o-mini Powered** - Advanced conversational AI with context awareness
- **💬 Conversation History** - Maintains context across multiple exchanges
- **🎨 Beautiful UI** - Animated voice visualization with Tailwind CSS
- **🔄 Continuous Mode** - Optional auto-listen for seamless dialogue
- **📱 Responsive Design** - Works on desktop and mobile
- **⚡ Fast & Optimized** - Next.js 15 with Edge Runtime

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shibinshagit/UNI-GPT.git
   cd UNI-GPT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit `http://localhost:3000`

## 🌐 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shibinshagit/UNI-GPT&env=OPENAI_API_KEY,OPENAI_MODEL)

### Manual Deployment

1. **Push to GitHub** (if not already done)

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `OPENAI_MODEL`: `gpt-4o-mini`
   - Click "Deploy"

3. **Your app will be live at:** `https://your-project.vercel.app`

## 🎯 Usage

1. **Click the microphone button** or the animated orb
2. **Speak your request** when you see "Listening..."
   - "What's the weather today?"
   - "What's on my schedule?"
   - "Add eggs to my grocery list"
   - "What can I cook with chicken?"
3. **Listen to the response** - The assistant speaks back automatically
4. **Optional:** Enable "Continuous Conversation Mode" for hands-free dialogue

## 📁 Project Structure

```
UNI-GPT/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # OpenAI API endpoint (server-side)
│   ├── globals.css           # Global styles & animations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main voice assistant UI
├── public/                   # Static assets
├── .env.local                # Environment variables (not committed)
├── .env.example              # Environment template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

## 🔧 Technical Details

### Architecture

- **Frontend:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS 4 with custom animations
- **Voice Input:** Web Speech API (browser-native)
- **Voice Output:** Speech Synthesis API (browser-native)
- **AI Backend:** OpenAI GPT-4o-mini via Next.js API Route
- **Runtime:** Edge Runtime for low latency

### API Route

The `/api/chat` endpoint:
- Runs on Vercel Edge Runtime (ultra-fast, globally distributed)
- Accepts `messages` array and `temperature` parameter
- Returns AI-generated responses
- API key secured server-side, never exposed to client

### Browser Compatibility

| Browser | Speech Recognition | Text-to-Speech | Status |
|---------|-------------------|----------------|--------|
| Chrome | ✅ Full Support | ✅ Full Support | ✅ **Recommended** |
| Edge | ✅ Full Support | ✅ Full Support | ✅ **Recommended** |
| Safari | ⚠️ Limited | ✅ Works | ⚠️ Partial |
| Firefox | ❌ Not Supported | ✅ Works | ❌ Not Recommended |

**Note:** Chrome or Edge required for voice input!

## 🔒 Privacy & Security

- **API keys server-side only** - Never exposed to client/browser
- **No conversation logging** - Conversations not stored on servers
- **HTTPS required** - Microphone access requires secure connection (Vercel provides this automatically)
- **Environment variables** - Sensitive data in `.env.local` (gitignored)

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

Create a `.env.local` file with:

```env
OPENAI_API_KEY=sk-...          # Your OpenAI API key (required)
OPENAI_MODEL=gpt-4o-mini        # Model to use (optional, defaults to gpt-4o-mini)
```

## 🗺️ Roadmap

This MVP will evolve into the full Uni-GPT system:

### Phase 2 - Skills Integration
- ✅ Google Calendar integration
- ✅ Gmail integration
- ✅ Weather API (OpenWeather)
- ✅ News briefings (RSS feeds)
- ✅ Recipe suggestions & cooking timers
- ✅ Grocery list management
- ✅ Smart home controls (Matter/MQTT)

### Phase 3 - Hardware Deployment
- Wake word detection ("Uni")
- Offline ASR with Whisper
- Low-latency TTS with Piper
- Debian-based device firmware
- 80-85dB noise resistance
- Hardware mute switch

## 🐛 Troubleshooting

### "Speech recognition not supported"
- Use Chrome or Edge browser
- Ensure you're on HTTPS (required for microphone access)
- Grant microphone permissions when prompted

### API Errors
- Verify `OPENAI_API_KEY` in `.env.local`
- Check you have OpenAI credits
- Ensure you're online
- Check Vercel function logs if deployed

### Voice Not Working
- Check browser compatibility
- Ensure speakers/audio are on
- Try different voice in browser settings

## 📄 License

Proprietary - UniQube Technologies

## 🤝 Contributing

This is a client project. For questions or contributions, contact the UniQube team.

---

**Built for UniQube** | Powered by OpenAI GPT-4o-mini | Created with [Claude Code](https://claude.com/claude-code)
