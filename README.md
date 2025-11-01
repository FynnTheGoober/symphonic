## Discord Music Bot (discord.js + TypeScript)

### Prerequisites
- Node.js `>=18.17` (recommend Node 20 LTS)
- A Discord account and a server to test in

### 1) Create your application and bot
1. Go to https://discord.com/developers/applications and create an application.
2. In the app, go to "Bot" and click "Add Bot". Copy the bot token and set it as `DISCORD_TOKEN`.
3. Copy your Application ID from the "General Information" page and set it as `APPLICATION_ID`.
4. Under "Bot" → "Privileged Gateway Intents", you do NOT need Message Content for this starter. Guild Members is optional.

### 2) Configure environment
- Copy `.env.example` to `.env` and fill in `DISCORD_TOKEN` and `APPLICATION_ID`.
- For rapid testing, set `GUILD_ID` to your server ID to register commands instantly.

### 3) Install & run
```
npm install
npm run register:commands   # deploys music commands (guild-scoped if GUILD_ID is set)
npm run dev                 # starts the bot with hot-reload
```

To invite the bot to your server, go to "OAuth2" → "URL Generator":
- Scopes: `bot` and `applications.commands`
- Bot Permissions: at minimum `Send Messages` (or just none for /ping replies)
Then open the generated URL to add the bot to your server.

### Scripts
- `dev`: Runs the bot via tsx with file watching.
- `register:commands`: Registers the slash commands (`/join`, `/play`, `/skip`, `/stop`, `/queue`, `/leave`, `/ping`).
- `build`: Compiles TypeScript to `dist/`.
- `start`: Runs the compiled JavaScript from `dist/`.

### Project Structure
- `src/index.ts`: Bot entrypoint; logs in and routes slash commands.
- `src/register-commands.ts`: Registers slash commands via Discord REST API.
- `src/music/manager.ts`: Minimal playback queue, connection, and track helper using `@discordjs/voice` + `play-dl`.
- `src/commands/`: Slash command implementations.
- `.env`: Secrets (token, app ID, optional guild ID).
- `tsconfig.json`: TypeScript config using ESM (`NodeNext`).

### Notes
- Global command changes can take up to 1 hour to appear. Use `GUILD_ID` during development for immediate updates.
- Keep your bot token secret. Never commit `.env`.
- `play-dl` can use optional env vars (e.g., `YOUTUBE_COOKIE`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`). Most basic playback works without them.
