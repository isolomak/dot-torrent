import { TorrentParser } from './TorrentParser/TorrentParser';

export function parse(data: string | Buffer) {
	return new TorrentParser(data).parse();
}

// TODO: export function create(data: object) {}

// TODO: export function parseFile() {}

export default { parse };
