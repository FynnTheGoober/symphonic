import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import { commands } from './commands/index.js';

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.APPLICATION_ID;
const guildId = process.env.GUILD_ID;

if (!token || !applicationId) {
  console.error('Missing DISCORD_TOKEN or APPLICATION_ID in environment.');
  process.exit(1);
}

const commandPayloads = commands.map(c => c.data.toJSON());

const rest = new REST({ version: '10' }).setToken(token);
const appId = applicationId as string;

async function main() {
  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(appId, guildId), {
        body: commandPayloads,
      });
      console.log(`Registered ${commandPayloads.length} command(s) to guild ${guildId}.`);
    } else {
      await rest.put(Routes.applicationCommands(appId), { body: commandPayloads });
      console.log(`Registered ${commandPayloads.length} global command(s).`);
      console.log('Note: Global command updates can take up to 1 hour.');
    }
  } catch (err) {
    console.error('Error registering commands:', err);
    process.exit(1);
  }
}

main();
