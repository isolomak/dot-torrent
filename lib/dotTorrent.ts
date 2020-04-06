import * as fs from 'fs';
import { IDotTorrentParams } from './types';
import { TorrentCreator } from './TorrentCreator';
import { TorrentParser } from './TorrentParser';

export function parse(data: string | Buffer) {
	return new TorrentParser(data).parse();
}

export function parseFile(filePath: string) {
	return new TorrentParser(fs.readFileSync(filePath)).parse();
}

export function create(torrentData: IDotTorrentParams, outPath: string) {
	return new TorrentCreator(torrentData).create(outPath);
}

export default { parse, parseFile, create };
