import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../Command.js';
import { musicManager } from './join.js';
import { Track } from '../../music/manager.js';

export const play: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from a URL or search query')
    .addStringOption(o => o.setName('query').setDescription('URL or search keywords').setRequired(true))
    .setDMPermission(false),
  async execute(interaction) {
    const member = interaction.guild?.members.cache.get(interaction.user.id) ?? (await interaction.guild?.members.fetch(interaction.user.id));
    const channel = member?.voice.channel;
    if (!channel) {
      await interaction.reply({ content: 'Join a voice channel first.', ephemeral: true });
      return;
    }

    const query = interaction.options.getString('query', true);
    await interaction.deferReply();

    const sub = musicManager.getOrCreate(channel.guild, channel);
    try {
      const track = await Track.from(query, interaction.user.tag);
      sub.enqueue(track);
      await interaction.editReply(`Queued: ${track.info.title}`);
    } catch (err) {
      await interaction.editReply('Failed to find or play that track.');
    }
  },
};
