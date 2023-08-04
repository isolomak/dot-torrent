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
export interface IDotTorrentFileInfo {
	length: number;
	path: string;
	offset: number;
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
	files: Array<IDotTorrentFileInfo>;
	infoHash: string;
	name: string | null;
	pieceLength: number | null;
	pieces: Array<Buffer>;
	private: boolean | null;
	publisher: string | null;
	publisherUrl: string | null;
	totalLength: number | null;
}
