import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../Command.js';
import { musicManager } from './join.js';

export const stop: Command = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Stop playback and clear the queue').setDMPermission(false),
  async execute(interaction) {
    const sub = musicManager.get(interaction.guildId!);
    if (!sub) {
      await interaction.reply({ content: 'Nothing to stop.', ephemeral: true });
      return;
    }
    sub.stop();
    await interaction.reply('Stopped and cleared the queue.');
  },
};
