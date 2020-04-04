import * as fs from 'fs';
import { TorrentParser } from './TorrentParser/TorrentParser';

export function parse(data: string | Buffer) {
	return new TorrentParser(data).parse();
}

export function parseFile(filePath: string) {
	return new TorrentParser(fs.readFileSync(filePath)).parse();
}

// TODO: export function create(data: object) {}


export default { parse };
