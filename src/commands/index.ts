import type { Command } from './Command.js';
import { ping } from './utility/ping.js';
import { join } from './music/join.js';
import { leave } from './music/leave.js';
import { play } from './music/play.js';
import { skip } from './music/skip.js';
import { stop } from './music/stop.js';
import { queue } from './music/queue.js';

export const commands: Command[] = [
  ping,
  join,
  leave,
  play,
  skip,
  stop,
  queue,
];

export const commandMap = new Map(commands.map(c => [c.data.name, c]));
