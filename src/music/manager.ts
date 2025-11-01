import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  entersState,
  type VoiceConnection,
  type AudioPlayer,
} from '@discordjs/voice';
import type { Guild, VoiceBasedChannel } from 'discord.js';
import { Readable } from 'node:stream';
import play from 'play-dl';

export interface TrackInfo {
  title: string;
  url: string;
  requestedBy?: string;
}

export class Track {
  public constructor(public info: TrackInfo, private readonly streamFactory: () => Promise<Readable>) {}

  static async from(query: string, requestedBy?: string): Promise<Track> {
    // Resolve a search or URL via play-dl
    const isUrl = /^https?:\/\//i.test(query);
    let video: play.YouTubeVideo | undefined;

    if (isUrl) {
      const result = await play.video_info(query);
      video = result.video_details;
    } else {
      const [res] = await play.search(query, { source: { youtube: 'video' }, limit: 1 });
      if (res && res.type === 'video') {
        video = (await play.video_info(res.url)).video_details;
      }
    }

    if (!video) throw new Error('No results found');

    const info: TrackInfo = {
      title: video.title ?? 'Unknown',
      url: video.url,
      requestedBy,
    };

    const factory = async () => {
      const stream = await play.stream(video!.url, { discordPlayerCompatibility: true });
      return stream.stream as Readable;
    };

    return new Track(info, factory);
  }

  async createAudioResource() {
    const stream = await this.streamFactory();
    return createAudioResource(stream, { inlineVolume: true });
  }
}

export class MusicSubscription {
  public readonly connection: VoiceConnection;
  public readonly player: AudioPlayer;
  public readonly queue: Track[] = [];
  public current: Track | null = null;

  constructor(channel: VoiceBasedChannel) {
    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: true,
    });

    this.player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });

    this.connection.subscribe(this.player);

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.processQueue();
    });
  }

  async ready() {
    await entersState(this.connection, VoiceConnectionStatus.Ready, 30_000);
  }

  enqueue(track: Track) {
    this.queue.push(track);
    if (this.player.state.status === AudioPlayerStatus.Idle) {
      this.processQueue();
    }
  }

  skip() {
    this.player.stop(true);
  }

  stop() {
    this.queue.length = 0;
    this.player.stop(true);
  }

  destroy() {
    try { this.stop(); } catch {}
    this.connection.destroy();
  }

  private async processQueue() {
    const next = this.queue.shift();
    if (!next) {
      this.current = null;
      return;
    }
    this.current = next;
    try {
      const resource = await next.createAudioResource();
      this.player.play(resource);
    } catch (err) {
      // Failed to create resource; move on
      this.processQueue();
    }
  }
}

export class MusicManager {
  private readonly subs = new Map<string, MusicSubscription>();

  getOrCreate(guild: Guild, channel: VoiceBasedChannel) {
    let sub = this.subs.get(guild.id);
    if (!sub) {
      sub = new MusicSubscription(channel);
      this.subs.set(guild.id, sub);
    }
    return sub;
  }

  get(guildId: string) {
    return this.subs.get(guildId);
  }

  leave(guildId: string) {
    const sub = this.subs.get(guildId);
    if (sub) {
      sub.destroy();
      this.subs.delete(guildId);
    }
  }
}

