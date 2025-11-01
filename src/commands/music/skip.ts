import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../Command.js';
import { musicManager } from './join.js';

export const skip: Command = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skip the current track').setDMPermission(false),
  async execute(interaction) {
    const sub = musicManager.get(interaction.guildId!);
    if (!sub) {
      await interaction.reply({ content: 'Nothing is playing.', ephemeral: true });
      return;
    }
    sub.skip();
    await interaction.reply('Skipped.');
  },
};
