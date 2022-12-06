import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import TorrentGenerator from './create/TorrentGenerator';
import TorrentParser from './parse/TorrentParser';
import { ICreateTorrentParams, IDotTorrent } from './types';

export * from './types';
export { create, parse, parseFromFileSync, parseFromFileAsync, TorrentParser, TorrentGenerator };

/**
 * Parse torrent from Buffer or string
 */
function parse(data: Buffer | string): IDotTorrent {
	const torrentParser = new TorrentParser();
	return torrentParser.parse(data);
}

/**
 * Parse torrent from file sync
 */
function parseFromFileSync(filePath: string): IDotTorrent {
	const torrentParser = new TorrentParser();

	const data = readFileSync(filePath);

	return torrentParser.parse(data);
}

/**
 * Parse torrent from file async
 */
async function parseFromFileAsync(filePath: string): Promise<IDotTorrent> {
	const torrentParser = new TorrentParser();

	const data = await readFile(filePath);

	return torrentParser.parse(data);
}

/**
 * Create torrent file
 */
async function create(parameters: ICreateTorrentParams, outPath: string): Promise<boolean> {
	return new TorrentGenerator(parameters).create(outPath);
}

export default { create, parse, parseFromFileSync, parseFromFileAsync };
