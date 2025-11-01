import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../Command.js';
import { MusicManager } from '../../music/manager.js';

const manager = new MusicManager();

export const join: Command = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join the voice channel you are in')
    .setDMPermission(false),
  async execute(interaction) {
    const member = interaction.guild?.members.cache.get(interaction.user.id) ?? (await interaction.guild?.members.fetch(interaction.user.id));
    const channel = member?.voice.channel;
    if (!channel || channel.type !== ChannelType.GuildVoice) {
      await interaction.reply({ content: 'You need to be in a voice channel.', ephemeral: true });
      return;
    }
    const sub = manager.getOrCreate(channel.guild, channel);
    await sub.ready().catch(() => {});
    await interaction.reply(`Joined <#${channel.id}>`);
  },
};

export { manager as musicManager };
