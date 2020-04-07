/**
 * A list of dictionaries each corresponding to a file (only when multiple files are being shared)
 */
export interface ITorrentFile {
	'length': number;
	'path': Array<Buffer> | Array<string>;
}

/**
 * This maps to a dictionary whose keys are dependent on whether one or more files are being shared
 */
export interface ITorrentInfo {
	'files': Array<ITorrentFile>;
	'length'?: number;
	'name': Buffer | string;
	'piece length': number;
	'pieces': Buffer;
	'private'?: number;
}

/**
 * A torrent file contains a list of files and integrity metadata about all the pieces,
 * and optionally contains a list of trackers
 */
export interface ITorrent {
	'announce': Buffer | string;
	'announce-list': Array<Array<Buffer | string>>;
	'comment'?: Buffer | string;
	'created by'?: Buffer | string;
	'creation date'?: number;
	'encoding'?: Buffer | string;
	'info': ITorrentInfo;
	'publisher'?: Buffer | string;
	'publisher-url'?: Buffer | string;
}

/**
 * Parsed file info from provided source
 */
export interface ISourceFileInfo {
	fullPath: string;
	relativePath: string;
	length: number;
}

/**
 * DotTorrent create method interface
 */
export interface ICreateTorrentParams {
	announceList: Array<string>;
	source: string;
	comment?: string;
	name?: string;
	private?: boolean;
	publisher?: string;
	publisherUrl?: string;
}

/**
 * Parsed torrent file interface
 */
export interface IDotTorrentFile {
	length: number;
	path: string;
}

/**
 * Parsed torrent interface
 */
export interface IDotTorrent {
	announce: string | null;
	announceList: Array<string>;
	comment: string | null;
	createdBy: string | null;
	createdAt: number | null;
	encoding: string | null;
	files: Array<IDotTorrentFile>;
	infoHash: string;
	name: string | null;
	pieceLength: number;
	pieces: Array<Buffer>;
	private: boolean;
	publisher: string | null;
	publisherUrl: string | null;
	totalLength: number;
}
