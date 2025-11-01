import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../Command.js';
import { musicManager } from './join.js';

export const leave: Command = {
  data: new SlashCommandBuilder().setName('leave').setDescription('Leave the voice channel').setDMPermission(false),
  async execute(interaction) {
    const guildId = interaction.guildId!;
    const sub = musicManager.get(guildId);
    if (!sub) {
      await interaction.reply({ content: 'Not connected to a voice channel.', ephemeral: true });
      return;
    }
    musicManager.leave(guildId);
    await interaction.reply('Left the voice channel.');
  },
};
