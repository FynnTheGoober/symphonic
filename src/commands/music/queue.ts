import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../Command.js';
import { musicManager } from './join.js';

export const queue: Command = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Show the current queue').setDMPermission(false),
  async execute(interaction) {
    const sub = musicManager.get(interaction.guildId!);
    if (!sub) {
      await interaction.reply({ content: 'Nothing queued.', ephemeral: true });
      return;
    }
    const now = sub.current ? `Now: ${sub.current.info.title}` : 'Now: nothing';
    const next = sub.queue.slice(0, 10).map((t, i) => `${i + 1}. ${t.info.title}`).join('\n') || '—';
    await interaction.reply(`${now}\nNext:\n${next}`);
  },
};
