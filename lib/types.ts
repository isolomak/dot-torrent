export interface ITorrent {
	announce: Buffer;
	'announce-list': Array<Array<Buffer>>;
	comment: Buffer;
	'created by': Buffer;
	'creation date': number;
	encoding: Buffer;
	info: {
		files: [{
			length: number;
			path: Buffer[];
		}];
		name: Buffer;
		'piece length': number;
		pieces: Buffer;
		private: number;
	};
	publisher: Buffer;
	'publisher-url': Buffer;
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
