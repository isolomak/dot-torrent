import * as fs from 'fs';
import { ICreateTorrentParams } from './types';
import TorrentGenerator from './create/TorrentGenerator';
import TorrentParser from './parse/TorrentParser';

/**
 * Parse torrent from Buffer or string
 */
function parse(data: Buffer | string) {
	return new TorrentParser(data).parse();
}

/**
 * Parse torrent file
 */
function parseFile(filePath: string) {
	return new TorrentParser(fs.readFileSync(filePath)).parse();
}

/**
 * Create torrent file
 */
function create(parameters: ICreateTorrentParams, outPath: string) {
	return new TorrentGenerator(parameters).create(outPath);
}

export { parse, parseFile, create };
export default { parse, parseFile, create };
