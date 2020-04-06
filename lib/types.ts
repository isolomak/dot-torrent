export interface ITorrentFile {
	length: number;
	path: Buffer[] | string[];
}

export interface ISourceFile {
	fullPath: string;
	relativePath: string;
	length: number;
}

export interface ITorrentInfo {
	files: ITorrentFile[];
	name: Buffer| string;
	'piece length': number;
	pieces: Buffer;
	private?: number;
}

export interface ITorrent {
	announce: Buffer | string;
	'announce-list': Array<Array<Buffer | string>>;
	comment?: Buffer | string;
	'created by'?: Buffer | string;
	'creation date'?: number;
	encoding?: Buffer | string;
	info: ITorrentInfo;
	publisher?: Buffer | string;
	'publisher-url'?: Buffer | string;
}

export interface IDotTorrentParams {
	announceList: string[];
	source: string;
	comment?: string;
	private?: boolean;
	publisher?: string;
	publisherUrl?: string;
}

export interface IDotTorrentFile {
	length: number;
	path: string;
}

export interface IDotTorrent {
	announce: string | null;
	announceList: string[];
	comment: string | null;
	createdBy: string | null;
	createdAt: number | null;
	encoding: string | null;
	files: IDotTorrentFile[];
	infoHash: string;
	name: string | null;
	pieceLength: number;
	pieces: Buffer[];
	private: boolean;
	publisher: string | null;
	publisherUrl: string | null;
}
